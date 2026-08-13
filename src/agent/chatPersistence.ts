export type PersistedChatTurn = {
  sessionId: string;
  userMessage: { id: string; content: string };
  assistantMessage: { id: string; content: string };
  responseMode: 'ai' | 'guided';
};

const getSupabaseConfiguration = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};

const insertRows = async (path: string, rows: unknown[], signal?: AbortSignal) => {
  const configuration = getSupabaseConfiguration();
  if (!configuration) return false;

  const response = await fetch(`${configuration.url}/rest/v1/${path}`, {
    method: 'POST',
    headers: {
      apikey: configuration.key,
      Authorization: `Bearer ${configuration.key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
    signal,
  });

  return response.ok;
};

export const persistChatTurn = async (turn: PersistedChatTurn, signal?: AbortSignal) => {
  try {
    const sessionStored = await insertRows('chat_sessions?on_conflict=id', [{
      id: turn.sessionId,
      channel: 'web',
      test_mode: true,
      status: 'open',
    }], signal);

    if (!sessionStored) return false;

    return insertRows('chat_messages?on_conflict=client_message_id', [
      {
        session_id: turn.sessionId,
        client_message_id: turn.userMessage.id,
        role: 'user',
        content: turn.userMessage.content,
        response_mode: null,
      },
      {
        session_id: turn.sessionId,
        client_message_id: turn.assistantMessage.id,
        role: 'assistant',
        content: turn.assistantMessage.content,
        response_mode: turn.responseMode,
      },
    ], signal);
  } catch {
    return false;
  }
};
