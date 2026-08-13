import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, ChevronDown, MessageCircle, Phone, RotateCcw, Send, X } from 'lucide-react';
import { company } from '../../config/company';
import { chatbotIntro, quickQuestions, quoteWhatsappText } from './chatbotKnowledge';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  reply: string;
  assistantMessageId: string;
  mode: 'ai' | 'guided';
  testMode: true;
};

type ConnectionMode = 'checking' | 'setup' | 'ai' | 'guided';

const CHAT_MESSAGES_KEY = 'mpsj_test_chat_messages_v1';
const CHAT_SESSION_KEY = 'mpsj_test_chat_session_v1';

const welcomeMessage: ChatMessage = {
  id: 'welcome-message',
  role: 'assistant',
  content: chatbotIntro,
};

const createId = () => crypto.randomUUID();

const loadSessionId = () => {
  const stored = localStorage.getItem(CHAT_SESSION_KEY);
  if (stored) return stored;
  const next = createId();
  localStorage.setItem(CHAT_SESSION_KEY, next);
  return next;
};

const loadMessages = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!stored) return [welcomeMessage];
    const parsed = JSON.parse(stored) as ChatMessage[];
    const valid = parsed.filter((message) =>
      typeof message?.id === 'string'
      && (message.role === 'user' || message.role === 'assistant')
      && typeof message.content === 'string',
    );
    return valid.length ? valid.slice(-20) : [welcomeMessage];
  } catch {
    return [welcomeMessage];
  }
};

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [sessionId, setSessionId] = useState(loadSessionId);
  const [isSending, setIsSending] = useState(false);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('checking');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsappUrl = useMemo(
    () => `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(quoteWhatsappText)}`,
    [],
  );

  useEffect(() => {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages.slice(-20)));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetch('/api/chat', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Health check failed')))
      .then((health: { aiConfigured?: boolean; knowledgeConfigured?: boolean }) => {
        if (!active) return;
        if (!health.knowledgeConfigured) setConnectionMode('setup');
        else setConnectionMode(health.aiConfigured ? 'ai' : 'guided');
      })
      .catch(() => {
        if (active) setConnectionMode('guided');
      });
    return () => { active = false; };
  }, [isOpen]);

  const sendQuestion = async (question: string) => {
    const content = question.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = { id: createId(), role: 'user', content };
    const requestMessages = [...messages, userMessage].slice(-14);
    setMessages(requestMessages);
    setInput('');
    setError('');
    setIsSending(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ sessionId, messages: requestMessages }),
        signal: controller.signal,
      });
      const payload = await response.json() as ChatResponse | { error?: string };
      if (!response.ok || !('reply' in payload)) {
        throw new Error('error' in payload && payload.error ? payload.error : 'No se pudo obtener respuesta.');
      }
      setConnectionMode(payload.mode);
      setMessages((current) => [...current, {
        id: payload.assistantMessageId,
        role: 'assistant' as const,
        content: payload.reply,
      }].slice(-20));
    } catch (requestError) {
      const message = requestError instanceof Error && requestError.name !== 'AbortError'
        ? requestError.message
        : 'La consulta ha tardado demasiado. Puede intentarlo de nuevo.';
      setError(message);
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendQuestion(input);
  };

  const resetConversation = () => {
    const nextSessionId = createId();
    setSessionId(nextSessionId);
    setMessages([welcomeMessage]);
    setInput('');
    setError('');
    localStorage.setItem(CHAT_SESSION_KEY, nextSessionId);
  };

  const statusText = connectionMode === 'checking'
    ? 'Comprobando conexión'
    : connectionMode === 'setup'
      ? 'Configuración privada pendiente'
    : connectionMode === 'ai'
      ? 'IA conectada · respuestas verificadas con herramientas'
      : 'Modo guiado · respuestas seguras predefinidas';

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end sm:right-6">
      {isOpen && (
        <section
          className="mb-4 flex h-[min(720px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:w-[410px]"
          aria-label="Asistente comercial de prueba"
        >
          <header className="bg-brand-navy p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Bot size={24} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black leading-tight">Asistente comercial</p>
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-950">Prueba</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-200">{statusText}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={resetConversation}
                  className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Nueva conversación"
                  title="Nueva conversación"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Cerrar chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-brand-blue text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void sendQuestion(question)}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-black leading-4 text-slate-700 transition hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 shadow-sm">
                  Consultando información…
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-bold leading-5 text-red-800">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="commercial-chat-input" className="sr-only">Escriba su consulta</label>
              <input
                id="commercial-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isSending}
                maxLength={2500}
                placeholder="Ej.: precio de un 6 x 2,40 con baño"
                className="min-w-0 flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-orange focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar consulta"
              >
                <Send size={19} />
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] font-bold leading-4 text-slate-500">
              Modo de prueba: no envía proformas, mensajes ni reserva turnos automáticamente.
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-green px-3 py-2 text-[11px] font-black text-white"
              >
                <Send size={14} /> WhatsApp
              </a>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700"
              >
                <Phone size={14} /> Llamar
              </a>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-4 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5 hover:brightness-105"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente'}
      >
        {isOpen ? <ChevronDown size={20} /> : <MessageCircle size={20} />}
        {isOpen ? 'Cerrar' : '¿Necesitas ayuda?'}
      </button>
    </div>
  );
};
