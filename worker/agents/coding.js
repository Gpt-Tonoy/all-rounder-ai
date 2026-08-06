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

// -----------------------------------------
// Multi-file Coding Agent
// -----------------------------------------

async function planFiles(env, projectDescription) {

  const messages = [
    {
      role: "system",
      content:
        'You are a software planner. Given a project description, output ONLY a JSON array of file plans. Each item must have "path" (string, relative repo path) and "instructions" (string, detailed instructions for that specific file). ONLY plan text-based code files (.html, .css, .js, .json, .md). NEVER plan binary/image files (.png, .jpg, .ico, .svg, .gif, .mp3, .wav) — if icons or graphics are needed, instruct the file to use CSS shapes, unicode/emoji characters, or inline SVG markup instead. No explanations, no markdown fences, just raw JSON. Keep it to 2-5 files.',
    },
    {
      role: "user",
      content: `Project: ${projectDescription}`,
    },
  ];

  const rawPlan = await askAI(env, messages);
  const cleanPlan = stripCodeFences(rawPlan);

  let files;

  try {
    files = JSON.parse(cleanPlan);
  } catch {
    throw new Error("Planner did not return valid JSON: " + cleanPlan.slice(0, 200));
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Planner returned an empty or invalid file list");
  }

  return files;

}

export async function runMultiFileCodingAgent(env, { projectDescription, folder }) {

  const plan = await planFiles(env, projectDescription);

  const results = [];

  for (const file of plan) {

    const fullPath = folder
      ? `${folder}/${file.path}`.replace(/\/+/g, "/")
      : file.path;

    try {

      const result = await runCodingAgent(env, {
        path: fullPath,
        instructions: file.instructions,
      });

      results.push({ ...result, success: true });

    } catch (err) {

      results.push({
        path: fullPath,
        success: false,
        error: err.message,
      });

    }

  }

  return {
    plan,
    results,
  };

}
