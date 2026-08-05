// =========================================
// AI
// =========================================

import { MODEL } from "./config.js";

export async function askAI(env, messages) {

  const ai = await env.AI.run(MODEL, {
    messages,
  });

  return ai.response || ai.result || ai;

}
