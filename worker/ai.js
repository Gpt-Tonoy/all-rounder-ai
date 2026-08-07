// =========================================
// AI - with Provider Fallback
// =========================================

import { CONFIG } from "./config.js";

async function askCloudflare(env, messages, options) {

  const ai = await env.AI.run(CONFIG.providers.cloudflare.model, {
    messages,
    max_tokens: options.max_tokens || 1024,
  });

  const reply = ai.response || ai.result;

  if (!reply) {
    throw new Error("Cloudflare AI returned empty response");
  }

  return reply;

}

async function askGroq(env, messages, options) {

  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const res = await fetch(CONFIG.providers.groq.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CONFIG.providers.groq.model,
      messages,
      max_tokens: options.max_tokens || 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Groq returned empty response");
  }

  return reply;

}

const PROVIDER_FUNCTIONS = {
  cloudflare: askCloudflare,
  groq: askGroq,
};

export async function askAI(env, messages, options = {}) {

  const errors = [];

  for (const providerName of CONFIG.providerOrder) {

    const providerFn = PROVIDER_FUNCTIONS[providerName];

    if (!providerFn) continue;

    try {

      const reply = await providerFn(env, messages, options);
      return reply;

    } catch (err) {

      errors.push(`${providerName}: ${err.message}`);

    }

  }

  throw new Error(
    `All AI providers failed. Errors: ${errors.join(" | ")}`
  );

}
