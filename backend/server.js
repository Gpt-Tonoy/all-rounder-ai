// ---------------------------------------------------------
// All-Rounder AI - Backend Server (Phase 1 - Foundation)
// No AI provider is connected yet. This just proves the
// frontend <-> backend connection works.
// ---------------------------------------------------------

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "All-Rounder AI Backend",
  });
});

// Temporary chat endpoint (no AI provider connected yet)
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  // Basic validation
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      message: "Request must include a 'message' string field.",
    });
  }

  // Placeholder response - real AI routing comes in a later phase
  res.json({
    success: true,
    message: "Backend connection successful.",
  });
});

app.listen(PORT, () => {
  console.log(`All-Rounder AI backend running on http://localhost:${PORT}`);
});
