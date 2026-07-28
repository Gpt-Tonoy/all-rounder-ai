# All-Rounder AI

A $0-budget-friendly, web-based AI platform. This is **Phase 1 — Foundation**:
a working frontend + backend skeleton with no AI provider connected yet.

Future phases will add: multi-provider AI routing, automatic fallback,
multimodal capabilities, and local-model fallback.

## Folder Structure

```
all-rounder-ai/
├── frontend/
│   ├── index.html      # Chat UI markup
│   ├── style.css        # Mobile-first styling
│   └── app.js            # Chat logic, calls backend API
├── backend/
│   ├── package.json    # Backend dependencies
│   └── server.js         # Express server (health + chat endpoints)
└── README.md
```

## Requirements

- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- A modern web browser

## Installation

1. Clone or download this repository.
2. Install backend dependencies:

   ```bash
   cd all-rounder-ai/backend
   npm install
   ```

## Running Locally

1. Start the backend server:

   ```bash
   cd all-rounder-ai/backend
   npm start
   ```

   The server will start at `http://localhost:3000`.

2. Open the frontend:

   Open `frontend/index.html` directly in a browser, or serve it with any
   static file server. The frontend is already configured to call the
   backend at `http://localhost:3000`.

3. Type a message in the chat input and press **Send** (or Enter). If the
   backend is running, you should see the reply: *"Backend connection
   successful."*

## Available API Endpoints

| Method | Endpoint       | Description                                   |
|--------|----------------|------------------------------------------------|
| GET    | `/api/health`  | Returns backend service status.                 |
| POST   | `/api/chat`    | Accepts `{ "message": "..." }` and returns a placeholder response. |

### Example: `/api/health` response

```json
{
  "status": "ok",
  "service": "All-Rounder AI Backend"
}
```

### Example: `/api/chat` request/response

Request body:

```json
{
  "message": "Hello"
}
```

Response body:

```json
{
  "success": true,
  "message": "Backend connection successful."
}
```

## Security Notes

- No API keys or secrets are used or stored in this phase.
- All AI provider calls will be handled server-side only, once added.
- No authentication is implemented yet (planned for a later phase).

## Next Phase

AI provider integration (starting with free-tier providers), intelligent
task routing, automatic fallback, multimodal support, and local-model
fallback will be added in the next phase — not in this foundation build.
