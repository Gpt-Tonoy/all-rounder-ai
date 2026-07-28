// ---------------------------------------------------------
// All-Rounder AI - Frontend Logic (Phase 1)
// ---------------------------------------------------------

// Backend API base URL.
// During local development the backend runs on port 3000.
// When deployed, replace this with your hosted backend URL.
const API_BASE_URL = "http://localhost:3000";

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

  // Auto-scroll to the latest message
  chatArea.scrollTop = chatArea.scrollHeight;
}

function setLoading(isLoading) {
  loadingIndicator.classList.toggle("active", isLoading);
  sendButton.disabled = isLoading;
}

// Sends the user's message to the backend and displays the response
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  messageInput.value = "";
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.message || "No response received.";
    addMessage(aiText, "ai");
  } catch (error) {
    addMessage(
      "⚠️ Could not reach the backend. Please make sure the server is running.",
      "ai"
    );
    console.error("Chat request failed:", error);
  } finally {
    setLoading(false);
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
