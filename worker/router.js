export const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";

export function classifyTask(message) {

  const text = (message || "").toLowerCase();

  if (
    text.includes("code") ||
    text.includes("javascript") ||
    text.includes("python") ||
    text.includes("html") ||
    text.includes("css") ||
    text.includes("bug")
  ) {
    return "coding";
  }

  if (
    text.includes("translate") ||
    text.includes("বাংলা") ||
    text.includes("english")
  ) {
    return "translation";
  }

  if (
    text.includes("math") ||
    text.includes("calculate")
  ) {
    return "math";
  }

  return "general";
}

export function selectModel(task) {
  return MODEL;
}

export function selectProvider(task) {
  return "cloudflare-workers-ai";
}

// -----------------------------------------
// Build Intent Detection
// -----------------------------------------

const BUILD_KEYWORDS = [
  "বানাও",
  "বানিয়ে দাও",
  "বানিয়ে দেও",
  "তৈরি করো",
  "তৈরি কর",
  "build",
  "create an app",
  "create a game",
  "make an app",
  "make a game",
  "make me",
  "build me",
];

export function isBuildRequest(message) {

  const text = (message || "").toLowerCase();

  return BUILD_KEYWORDS.some((keyword) => text.includes(keyword));

}
