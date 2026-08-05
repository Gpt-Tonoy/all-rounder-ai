// =========================================
// Memory
// =========================================

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
