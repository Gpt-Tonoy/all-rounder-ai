// =========================================
// All-Rounder AI Assistant Configuration
// =========================================

export const APP_NAME = "All-Rounder AI Assistant";

export const VERSION = "v1";

export const CONFIG = {
  providers: {
    cloudflare: {
      model: "@cf/meta/llama-3.1-8b-instruct-fp8",
    },
    groq: {
      apiUrl: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant",
    },
  },
  providerOrder: ["cloudflare", "groq"],
};
