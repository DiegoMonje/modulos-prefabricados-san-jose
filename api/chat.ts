import { z } from 'zod';
import { createCommercialAgent, DEFAULT_COMMERCIAL_MODEL } from '../src/agent/commercialAgent.js';
import {
  buildGuidedResponse,
  commercialConfigSchema,
  type CommercialConfig,
} from '../src/agent/commercialKnowledge.js';

const messageSchema = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2500),
});

const chatRequestSchema = z.object({
  sessionId: z.string().uuid(),
  messages: z.array(messageSchema).min(1).max(14),
});

type RateEntry = { count: number; resetAt: number };
const rateEntries = new Map<string, RateEntry>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 12;
let cachedCommercialConfig: CommercialConfig | null = null;
let cachedCommercialConfigParts = 0;

const COMMERCIAL_KNOWLEDGE_PART_NAMES = [
  'COMMERCIAL_KNOWLEDGE_PART_1',
  'COMMERCIAL_KNOWLEDGE_PART_2',
  'COMMERCIAL_KNOWLEDGE_PART_3',
  'COMMERCIAL_KNOWLEDGE_PART_4',
] as const;

const json = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
});

const getClientIp = (request: Request) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  || request.headers.get('x-real-ip')
  || 'unknown';

const isRateLimited = (key: string) => {
  const now = Date.now();
  const current = rateEntries.get(key);
  if (!current || current.resetAt <= now) {
    rateEntries.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
};

const aiCredentialsAvailable = () => Boolean(
  process.env.AI_GATEWAY_API_KEY
  || process.env.VERCEL_OIDC_TOKEN,
);

const safeErrorMessage = (error: unknown) => error instanceof Error ? error.message.slice(0, 180) : 'Unknown error';

const inspectCommercialConfig = () => {
  if (cachedCommercialConfig) {
    return { status: 'ready' as const, config: cachedCommercialConfig, configuredParts: cachedCommercialConfigParts };
  }
  const singleVariableConfig = process.env.COMMERCIAL_KNOWLEDGE_PREVIEW_JSON
    || process.env.COMMERCIAL_KNOWLEDGE_JSON;
  const configuredParts = COMMERCIAL_KNOWLEDGE_PART_NAMES
    .filter((name) => Object.prototype.hasOwnProperty.call(process.env, name));
  const splitVariableConfig = configuredParts.length === COMMERCIAL_KNOWLEDGE_PART_NAMES.length
    && COMMERCIAL_KNOWLEDGE_PART_NAMES.every((name) => Boolean(process.env[name]))
    ? COMMERCIAL_KNOWLEDGE_PART_NAMES.map((name) => process.env[name] || '').join('')
    : null;
  const rawConfig = splitVariableConfig || singleVariableConfig;

  if (!rawConfig) {
    const hasSingleVariable = Object.prototype.hasOwnProperty.call(process.env, 'COMMERCIAL_KNOWLEDGE_PREVIEW_JSON')
      || Object.prototype.hasOwnProperty.call(process.env, 'COMMERCIAL_KNOWLEDGE_JSON');
    const status = configuredParts.length > 0 && configuredParts.length < COMMERCIAL_KNOWLEDGE_PART_NAMES.length
      ? 'partial' as const
      : hasSingleVariable || configuredParts.length === COMMERCIAL_KNOWLEDGE_PART_NAMES.length
      ? 'empty' as const
      : 'missing' as const;
    return { status, config: null, configuredParts: configuredParts.length };
  }
  try {
    cachedCommercialConfig = commercialConfigSchema.parse(JSON.parse(rawConfig));
    cachedCommercialConfigParts = configuredParts.length;
    return { status: 'ready' as const, config: cachedCommercialConfig, configuredParts: configuredParts.length };
  } catch {
    return { status: 'invalid' as const, config: null, configuredParts: configuredParts.length };
  }
};

const loadCommercialConfig = () => {
  const result = inspectCommercialConfig();
  if (!result.config) throw new Error(`COMMERCIAL_KNOWLEDGE_JSON is ${result.status}`);
  return result.config;
};

const handlePost = async (request: Request) => {
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 40_000) return json({ error: 'La conversación es demasiado larga.' }, 413);
  if (isRateLimited(getClientIp(request))) return json({ error: 'Demasiadas consultas seguidas. Espere un minuto y vuelva a intentarlo.' }, 429);

  let parsedBody: z.infer<typeof chatRequestSchema>;
  try {
    parsedBody = chatRequestSchema.parse(await request.json());
  } catch {
    return json({ error: 'La consulta no tiene un formato válido.' }, 400);
  }

  const totalCharacters = parsedBody.messages.reduce((sum, message) => sum + message.content.length, 0);
  if (totalCharacters > 16_000) return json({ error: 'La conversación es demasiado larga. Inicie una conversación nueva.' }, 413);

  const lastMessage = parsedBody.messages[parsedBody.messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') return json({ error: 'La última intervención debe ser una pregunta del cliente.' }, 400);

  let commercialConfig;
  try {
    commercialConfig = loadCommercialConfig();
  } catch (error) {
    console.error('Private commercial configuration unavailable:', safeErrorMessage(error));
    return json({ error: 'El asistente de prueba todavía no tiene cargada su configuración comercial privada.' }, 503);
  }

  let reply: string;
  let mode: 'ai' | 'guided' = 'guided';

  if (aiCredentialsAvailable()) {
    try {
      const result = await createCommercialAgent(commercialConfig).generate({
        messages: parsedBody.messages.map(({ role, content }) => ({ role, content })),
        abortSignal: request.signal,
        timeout: { totalMs: 25_000 },
      });
      reply = result.text.trim();
      if (!reply) throw new Error('Empty model response');
      mode = 'ai';
    } catch (error) {
      console.warn('Commercial agent switched to guided mode:', safeErrorMessage(error));
      reply = buildGuidedResponse(commercialConfig, lastMessage.content);
    }
  } else {
    reply = buildGuidedResponse(commercialConfig, lastMessage.content);
  }

  const assistantMessageId = crypto.randomUUID();
  return json({
    reply,
    assistantMessageId,
    mode,
    persisted: false,
    testMode: true,
  });
};

export default {
  async fetch(request: Request) {
    if (request.method === 'GET') {
      const knowledge = inspectCommercialConfig();
      return json({
        status: 'ok',
        testMode: true,
        knowledgeConfigured: knowledge.status === 'ready',
        knowledgeStatus: knowledge.status,
        knowledgeParts: `${knowledge.configuredParts}/${COMMERCIAL_KNOWLEDGE_PART_NAMES.length}`,
        environmentProbe: Object.prototype.hasOwnProperty.call(process.env, 'CHATBOT_ENV_TEST'),
        aiConfigured: aiCredentialsAvailable(),
        model: aiCredentialsAvailable() ? (process.env.AI_MODEL || DEFAULT_COMMERCIAL_MODEL) : null,
        automaticMessages: false,
        automaticQuotes: false,
      });
    }

    if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
    return handlePost(request);
  },
};
