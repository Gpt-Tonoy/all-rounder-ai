export const CONFIG = {
  providers: {
    cloudflare: {
      model: "@cf/meta/llama-3.1-8b-instruct-fp8",
    },
    groq: {
      apiUrl: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant", // ফ্রি, ফাস্ট, ভালো quality
    },
  },
  // ক্রম অনুযায়ী চেষ্টা হবে
  providerOrder: ["cloudflare", "groq"],
};
