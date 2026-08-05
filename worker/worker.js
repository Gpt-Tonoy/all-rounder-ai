// =========================================
// All-Rounder AI Assistant v1
// Main Worker
// =========================================

import { APP_NAME, VERSION } from "./config.js";
import { CORS, json } from "./cors.js";
import { classifyTask } from "./router.js";
import { getSystemPrompt } from "./prompts.js";
import { buildMessages } from "./memory.js";
import { runTools } from "./tools.js";
import { askAI } from "./ai.js";

export default {

  async fetch(request, env) {

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: CORS,
      });
    }

    const url = new URL(request.url);

    // Health Check
    if (request.method === "GET" && url.pathname === "/") {

      return json({
        success: true,
        name: APP_NAME,
        version: VERSION,
        status: "online",
        message: "Worker is running successfully."
      });

    }

    // Chat API
    if (request.method === "POST" && url.pathname === "/api/chat") {

      try {

        const body = await request.json();

        const message = body.message || "";

        // Router
        const task = classifyTask(message);

        // Prompt
        const systemPrompt = getSystemPrompt(task);

        // Tools
        const tool = runTools(message);

        if (tool.handled) {
          return json({
            success: true,
            provider: "tool",
            reply: tool.message
          });
        }

        // Memory
        const messages = buildMessages(systemPrompt, message);

        // AI
        const reply = await askAI(env, messages);

        return json({
          success: true,
          task,
          reply
        });

      } catch (err) {

        return json({
          success: false,
          error: err.message
        }, 500);

      }

    }

    return json({
      success: false,
      error: "Not Found"
    }, 404);

  }

};
