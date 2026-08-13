import { commercialConfigSchema, type CommercialConfig } from './commercialKnowledge';

let cachedConfig: CommercialConfig | null = null;

const parseConfig = (value: unknown) => commercialConfigSchema.parse(value);

const loadFromEnvironment = () => {
  const serialized = process.env.COMMERCIAL_KNOWLEDGE_JSON;
  if (!serialized) return null;
  return parseConfig(JSON.parse(serialized));
};

const loadFromSupabase = async (signal?: AbortSignal) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  const response = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/agent_settings?key=eq.commercial_knowledge&select=value&limit=1`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: 'application/json',
      },
      signal,
    },
  );

  if (!response.ok) throw new Error(`Private commercial configuration unavailable (${response.status}).`);
  const rows = await response.json() as Array<{ value?: unknown }>;
  return rows[0]?.value ? parseConfig(rows[0].value) : null;
};

export const loadCommercialConfig = async (signal?: AbortSignal) => {
  if (cachedConfig) return cachedConfig;
  const config = loadFromEnvironment() ?? await loadFromSupabase(signal);
  if (!config) throw new Error('Private commercial configuration is not configured.');
  cachedConfig = config;
  return config;
};
