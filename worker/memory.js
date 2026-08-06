// =========================================
// Memory
// =========================================

const MAX_HISTORY_MESSAGES = 20; // token limit এর মধ্যে রাখতে সীমিত রাখা হচ্ছে

export function buildMessages(systemPrompt, message, history = []) {

  return [
    {
      role: "system",
      content: systemPrompt,
    },

    ...history,

    {
      role: "user",
      content: message,
    },
  ];

}

export async function getHistory(env, sessionId) {

  if (!env.CHAT_MEMORY || !sessionId) {
    return [];
  }

  const stored = await env.CHAT_MEMORY.get(`session:${sessionId}`);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }

}

export async function saveHistory(env, sessionId, history) {

  if (!env.CHAT_MEMORY || !sessionId) {
    return;
  }

  // পুরনো মেসেজ ছেঁটে ফেলা যাতে size/token limit না ছাড়ায়
  const trimmed = history.slice(-MAX_HISTORY_MESSAGES);

  await env.CHAT_MEMORY.put(
    `session:${sessionId}`,
    JSON.stringify(trimmed),
    { expirationTtl: 60 * 60 * 24 * 7 } // ৭ দিন পর অটো এক্সপায়ার
  );

}
