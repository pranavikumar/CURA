
  # AXON app development plan

  This is a code bundle for CURA app development plan. The original project is available at https://www.figma.com/design/92xorX5vKcbl7FuEdVFc48/AXON-app-development-plan.

  ## Running the code

  Run `npm i` to install the dependencies.

  Copy `.env.example` to `.env` and set `DEEPSEEK_API_KEY`.
  The frontend reads `VITE_CHAT_API_URL` (defaults to `http://localhost:8787`).

  Run `npm run api` to start the chat backend on `http://localhost:8787`.

  Run `npm run dev` to start the frontend development server.
  