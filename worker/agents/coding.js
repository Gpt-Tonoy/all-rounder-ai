// =========================================
// Coding Agent
// =========================================

import { askAI } from "../ai.js";
import { commitFile } from "../tools/github.js";

function stripCodeFences(text) {
  return text
    .replace(/^```[\w]*\n/, "")
    .replace(/```$/, "")
    .trim();
}

export async function runCodingAgent(env, { path, instructions }) {

  const messages = [
    {
      role: "system",
      content:
        "You are a coding agent. Output ONLY the raw code for the requested file. No explanations, no markdown code fences, no commentary before or after the code.",
    },
    {
      role: "user",
      content: `Write the complete code for the file "${path}".\n\nInstructions:\n${instructions}`,
    },
  ];

  const rawCode = await askAI(env, messages);
  const code = stripCodeFences(rawCode);

  const result = await commitFile(
    env,
    path,
    code,
    `Coding Agent: update ${path}`
  );

  return {
    path,
    committed: true,
    commitUrl: result.commit.html_url,
  };

}
