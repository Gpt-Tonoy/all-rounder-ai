// ---------------------------------------------------------
// All-Rounder AI - Frontend Logic
// GitHub Pages → Cloudflare Worker → Workers AI
// ---------------------------------------------------------

const API_BASE_URL = "https://all-rounder-ai-v3.tonoygpt.workers.dev";

// প্রতি ব্রাউজারের জন্য একটা ইউনিক sessionId - localStorage এ সেভ থাকে
function getSessionId() {
  let sessionId = localStorage.getItem("allrounder_session_id");

  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("allrounder_session_id", sessionId);
  }

  return sessionId;
}

const sessionId = getSessionId();

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

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Server Error");
    }

    const aiText = data.reply || "No response received.";

    addMessage(aiText, "ai");

  } catch (err) {

    console.error(err);
    addMessage("⚠️ AI request failed. Please try again.", "ai");

  } finally {

    setLoading(false);
    messageInput.focus();

  }

}

// --------------------------------------------
// Send Button
// --------------------------------------------
sendButton.addEventListener("click", sendMessage);

// --------------------------------------------
// Enter Key
// --------------------------------------------
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
