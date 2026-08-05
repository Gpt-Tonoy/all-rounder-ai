// ---------------------------------------------------------
// All-Rounder AI - Frontend Logic
// GitHub Pages → Cloudflare Worker → Workers AI
// ---------------------------------------------------------

// Cloudflare Worker API
const API_BASE_URL =
  "https://all-rounder-ai-v2.tonoygpt.workers.dev";

let chatHistory = [];


const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const loadingIndicator = document.getElementById("loadingIndicator");

// Adds a message bubble to the chat area
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}-bubble`;
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatArea.appendChild(messageDiv);

  // Auto-scroll to latest message
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Loading state
function setLoading(isLoading) {
  loadingIndicator.classList.toggle("active", isLoading);
  sendButton.disabled = isLoading;
}

// Sends message to Cloudflare Worker
async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text || sendButton.disabled) return;

  addMessage(text, "user");
  messageInput.value = "";
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        history: chatHistory,
      
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        `Server responded with status ${response.status}`
      );
    }

    const aiText =
      data?.message ||
      "No response received.";

    chatHistory.push({
  role: "user",
  content: text
});

chatHistory.push({
  role: "assistant",
  content: aiText
});

if (chatHistory.length > 20) {
  chatHistory = chatHistory.slice(-20);
}

    addMessage(aiText, "ai");

  } catch (error) {
    console.error("Chat request failed:", error);

    addMessage(
      "⚠️ AI request failed. Please try again.",
      "ai"
    );

  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

// Send button
sendButton.addEventListener("click", sendMessage);

// Enter key
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
