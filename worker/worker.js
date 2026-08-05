const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    // CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: CORS,
      });
    }

    const url = new URL(request.url);

    // Health Check
    if (request.method === "GET" && url.pathname === "/") {
      return Response.json(
        {
          success: true,
          name: "All-Rounder AI Assistant",
          version: "v1",
          status: "online",
          message: "Worker is running successfully."
        },
        {
          headers: CORS,
        }
      );
    }

    // Chat Endpoint
    if (request.method === "POST" && url.pathname === "/api/chat") {
      try {
        const body = await request.json();
        const message = body.message || "";

        const ai = await env.AI.run(MODEL, {
          messages: [
            {
              role: "system",
              content:
                "You are All-Rounder AI Assistant v1. Answer clearly, accurately, and concisely."
            },
            {
              role: "user",
              content: message
            }
          ]
        });

        return Response.json(
          {
            success: true,
            model: MODEL,
            reply: ai.response || ai.result || ai
          },
          {
            headers: CORS,
          }
        );
      } catch (err) {
        return Response.json(
          {
            success: false,
            error: err.message
          },
          {
            status: 500,
            headers: CORS,
          }
        );
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: CORS,
    });
  },
};
