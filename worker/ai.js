// =========================================
// AI
// =========================================

import { MODEL } from "./config.js";

export async function askAI(env, messages, options = {}) {

  const ai = await env.AI.run(MODEL, {
    messages,
    max_tokens: options.max_tokens || 1024,
  });

  return ai.response || ai.result || ai;

}
