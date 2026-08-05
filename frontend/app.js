// ---------------------------------------------------------
// All-Rounder AI - Frontend Logic
// GitHub Pages → Cloudflare Worker → Workers AI
// ---------------------------------------------------------

// Cloudflare Worker API
const API_BASE_URL =
  "https://all-rounder-ai-v2.tonoygpt.workers.dev";

// Session chat history
let chatHistory = [];

// DOM Elements
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const loadingIndicator = document.getElementById("loadingIndicator");

// --------------------------------------------
// Add Chat Message
// --------------------------------------------
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}-bubble`;
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatArea.appendChild(messageDiv);

  chatArea.scrollTop = chatArea.scrollHeight;
}

// --------------------------------------------
// Loading State
// --------------------------------------------
function setLoading(isLoading) {
  loadingIndicator.classList.toggle("active", isLoading);

  sendButton.disabled = isLoading;
  messageInput.disabled = isLoading;
}

// --------------------------------------------
// Send Message
// --------------------------------------------
async function sendMessage() {

  const text = messageInput.value.trim();

  if (!text) return;
  if (sendButton.disabled) return;

  addMessage(text, "user");

  messageInput.value = "";

  setLoading(true);

  try {

    const response = await fetch(
      `${API_BASE_URL}/api/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Server Error"
      );
    }

    const aiText =
      data.message ||
      "No response received.";

    // Save conversation
    chatHistory.push({
      role: "user",
      content: text
    });

    chatHistory.push({
      role: "assistant",
      content: aiText
    });

    // Keep only last 20 messages
    if (chatHistory.length > 20) {
      chatHistory =
        chatHistory.slice(-20);
    }

    addMessage(aiText, "ai");

  } catch (err) {

    console.error(err);

    addMessage(
      "⚠️ AI request failed. Please try again.",
      "ai"
    );

  } finally {

    setLoading(false);

    messageInput.focus();

  }

}

// --------------------------------------------
// Send Button
// --------------------------------------------
sendButton.addEventListener(
  "click",
  sendMessage
);

// --------------------------------------------
// Enter Key
// --------------------------------------------
messageInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  }
);

// --------------------------------------------
// Welcome Message
// --------------------------------------------
addMessage(
  "Hi! I'm All-Rounder AI. Ask me anything to test the connection.",
  "ai"
);
