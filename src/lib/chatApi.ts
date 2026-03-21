/**
 * Chat API base URL.
 * - Dev (default): empty → `/api/chat` (Vite proxies to the Node server on PORT).
 * - Override: set `VITE_CHAT_API_URL` to e.g. `http://localhost:8787` for a direct backend URL.
 */
export function getChatApiUrl(): string {
  const raw = import.meta.env.VITE_CHAT_API_URL;
  const base = typeof raw === "string" ? raw.trim() : "";
  if (base === "") {
    return "/api/chat";
  }
  return `${base.replace(/\/$/, "")}/api/chat`;
}
