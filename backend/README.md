# AXON Next.js Backend

## Setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Fill in your API key in `.env.local`:

- `DEEPSEEK_API_KEY` (from [DeepSeek Platform](https://platform.deepseek.com/))
- optionally `DEEPSEEK_MODEL` (defaults to `deepseek-chat`; you can use `deepseek-reasoner` for the reasoning model)

3. Install and run **from the `backend/` folder** (this is separate from the Vite app on port 5173):

```bash
cd backend
pnpm install
pnpm dev
```

The backend runs on `http://localhost:3000`.

**If the frontend shows errors calling `:3000/api/study-content`:**

- Run this backend in its own terminal (`cd backend && pnpm dev`). The root `pnpm dev` only starts Vite — it does **not** start Next.js.
- Put `ANTHROPIC_API_KEY` in `backend/.env.local` and restart the backend after editing.
- In the browser **Network** tab, open the failed request → **Response** to read the JSON `error` message (missing key, Claude API error, or invalid LLM JSON).

## API

- `POST /api/study-content`
  - Body (optional): `{ "topic": "your topic" }`
  - Returns JSON shaped like the frontend mock dataset:
    - `drugs`
    - `diseases`
    - `cards`
    - `anatomyModels`
    - `practiceQuestionsByCard`
