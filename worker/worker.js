// =========================================
// All-Rounder AI Assistant v1
// Main Worker
// =========================================

import { APP_NAME, VERSION } from "./config.js";
import { CORS, json } from "./cors.js";
import { classifyTask } from "./router.js";
import { getSystemPrompt } from "./prompts.js";
import { buildMessages, getHistory, saveHistory } from "./memory.js";
import { runTools } from "./tools.js";
import { askAI } from "./ai.js";
import { runCodingAgent, runMultiFileCodingAgent } from "./agents/coding.js";

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
        const sessionId = body.sessionId || "default";

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

        // Memory - load
        const history = await getHistory(env, sessionId);

        // Build messages with history
        const messages = buildMessages(systemPrompt, message, history);

        // AI
        const reply = await askAI(env, messages);

        // Memory - save (user message + AI reply যোগ করে)
        const updatedHistory = [
          ...history,
          { role: "user", content: message },
          { role: "assistant", content: reply },
        ];

        await saveHistory(env, sessionId, updatedHistory);

        return json({
          success: true,
          task,
          sessionId,
          reply
        });

      } catch (err) {

        return json({
          success: false,
          error: err.message
        }, 500);

      }

    }

    // Coding Agent API (single file)
    if (request.method === "POST" && url.pathname === "/api/agent/code") {

      try {

        const body = await request.json();

        const path = body.path;
        const instructions = body.instructions;

        if (!path || !instructions) {
          return json({
            success: false,
            error: "Both 'path' and 'instructions' are required"
          }, 400);
        }

        const result = await runCodingAgent(env, { path, instructions });

        return json({
          success: true,
          ...result
        });

      } catch (err) {

        return json({
          success: false,
          error: err.message
        }, 500);

      }

    }

    // Multi-file Coding Agent API
    if (request.method === "POST" && url.pathname === "/api/agent/build") {

      try {

        const body = await request.json();

        const projectDescription = body.projectDescription;
        const folder = body.folder || "";

        if (!projectDescription) {
          return json({
            success: false,
            error: "'projectDescription' is required"
          }, 400);
        }

        const result = await runMultiFileCodingAgent(env, {
          projectDescription,
          folder
        });

        return json({
          success: true,
          ...result
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
