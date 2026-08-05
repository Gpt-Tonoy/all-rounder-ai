export function getSystemPrompt(task) {

  switch (task) {

    case "coding":
      return "You are an expert programming assistant. Write clean and correct code.";

    case "translation":
      return "You are a professional translator. Preserve meaning naturally.";

    case "math":
      return "You are a mathematics expert. Solve step by step.";

    default:
      return "You are All-Rounder AI Assistant. Be accurate, concise and helpful.";

  }

}
