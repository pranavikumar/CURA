import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createServer } from "node:http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");

/** Load .env then .env.local (local overrides). Works even if cwd is not the project root. */
function loadEnvFiles() {
  const envPath = path.join(PROJECT_ROOT, ".env");
  const localPath = path.join(PROJECT_ROOT, ".env.local");
  const main = dotenv.config({ path: envPath });
  const local = dotenv.config({ path: localPath, override: true });
  if (main.error && local.error) {
    console.warn(
      `[chat-server] No file at ${envPath} or ${localPath} — using shell env only.`,
    );
  } else {
    if (!main.error) console.log(`[chat-server] Loaded ${envPath}`);
    if (!local.error) console.log(`[chat-server] Loaded ${localPath}`);
  }
}
/** Trim whitespace, optional quotes, UTF-8 BOM — common reasons the key looked "missing". */
function normalizeApiKey(raw) {
  if (raw == null || raw === "") return "";
  let s = String(raw).trim();
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  s = s.replace(/^["']|["']$/g, "");
  return s.trim();
}

loadEnvFiles();

console.log(
  `[chat-server] env: DEEPSEEK_API_KEY=${Boolean(process.env.DEEPSEEK_API_KEY)}`,
);

const PORT = Number(process.env.PORT || 8787);
const DEEPSEEK_API_KEY = normalizeApiKey(process.env.DEEPSEEK_API_KEY);
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

if (!DEEPSEEK_API_KEY) {
  console.warn(
    `[chat-server] No API key in env. Create ${path.join(PROJECT_ROOT, ".env")} with:\n` +
      `  DEEPSEEK_API_KEY=sk-...\n` +
      `Use the exact name .env (not .env.txt). One line, no spaces around =.`,
  );
} else {
  console.log(`[chat-server] API key OK (${DEEPSEEK_API_KEY.length} chars).`);
}
const MAX_INPUT_CHARS = 500;

const BASE_REFUSAL =
  "I answer questions about the current Anki card. Please ask about this card's content.";

/** Path without query string; strips trailing slashes so /api/chat/ matches /api/chat */
function normalizePathname(url) {
  const path = url.split("?")[0] || "/";
  return path.replace(/\/+$/, "") || "/";
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function isClearlyOffTopic(question) {
  const q = question.toLowerCase();
  const obviousOffTopic = [
    "weather",
    "bitcoin",
    "stocks",
    "politics",
    "movie",
    "music",
    "recipe",
    "vacation",
    "javascript",
    "python",
    "dating",
    "sports",
    "news",
  ];
  return obviousOffTopic.some((term) => q.includes(term));
}

function buildPrompt(question, cardFront, cardBack) {
  return `
You are an Anki flashcard tutor.

Your job:
- Help the user understand the current card.
- If the question is even loosely related to the card, answer it.
- You may define terms, explain mechanisms, or give brief medical context.

Only refuse if the question is clearly unrelated (e.g. weather, coding, politics).

Keep answers concise (2–5 sentences).

CARD FRONT:
${cardFront}

CARD BACK:
${cardBack}

USER QUESTION:
${question}

Return ONLY valid JSON:
{"answer": string}
`.trim();
}

function parseModelJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";

async function askDeepSeek(question, cardFront, cardBack) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error(
      `Missing DEEPSEEK_API_KEY. Put the key in ${path.join(PROJECT_ROOT, ".env")} — see server startup logs.`,
    );
  }

  const response = await fetch(DEEPSEEK_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: 400,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: buildPrompt(question, cardFront, cardBack),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = String(data?.choices?.[0]?.message?.content ?? "").trim();
  console.log("RAW MODEL OUTPUT:", text);
  console.log({ question, cardFront, cardBack });
  const parsed = parseModelJson(text);

  // ✅ If parsing fails, just return raw text instead of rejecting
  if (!parsed || typeof parsed.answer !== "string") {
    return { answer: text || BASE_REFUSAL };
  }

  return { answer: parsed.answer.trim() || BASE_REFUSAL };
}

const server = createServer(async (req, res) => {
  console.log("Incoming request:", req.method, req.url);

  if (req.method === "OPTIONS") {
    return sendJson(res, 204, {});
  }

  const pathname = normalizePathname(req.url);

  // Opening http://localhost:8787/ in a browser sends GET / — not an error, just not the chat endpoint.
  if (pathname === "/" && req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      service: "axon-chat-api",
      message:
        "This URL only accepts POST /api/chat with JSON. A plain browser visit uses GET / and will not run chat.",
      usage: {
        method: "POST",
        path: "/api/chat",
        headers: { "Content-Type": "application/json" },
        body: {
          question: "Your question",
          card: { front: "Card front text", back: "Card back text" },
        },
      },
    });
  }

  if (pathname === "/api/chat" && req.method === "GET") {
    return sendJson(res, 405, {
      error: "Method not allowed",
      hint: "Use POST with Content-Type: application/json (see GET / for example).",
    });
  }

  if (pathname !== "/api/chat" || req.method !== "POST") {
    console.log("No route match:", { pathname, method: req.method });
    return sendJson(res, 404, { error: "Not found", path: pathname });
  }

  let body = "";
  req.on("data", (chunk) => {
    console.log("Receiving chunk...", chunk?.length ?? 0, "bytes");
    body += chunk;
  });

  req.on("error", (err) => {
    console.error("Request stream error:", err);
  });

  req.on("end", async () => {
    console.log("Body complete, length:", body.length);
    if (!body.length) {
      console.warn(
        "Empty request body — client may not be sending JSON (check Content-Type, CORS, or URL).",
      );
    }
    try {
      let parsed;
      try {
        parsed = JSON.parse(body || "{}");
      } catch (parseErr) {
        console.error("Invalid JSON body:", parseErr);
        return sendJson(res, 400, { error: "Invalid JSON body." });
      }
      const question = String(parsed?.question || "").trim();
      const cardFront = String(parsed?.card?.front || "").trim();
      const cardBack = String(parsed?.card?.back || "").trim();

      if (!question || !cardFront || !cardBack) {
        console.log("400 missing fields:", {
          hasQuestion: Boolean(question),
          hasFront: Boolean(cardFront),
          hasBack: Boolean(cardBack),
        });
        return sendJson(res, 400, { error: "Missing question or card context." });
      }

      if (question.length > MAX_INPUT_CHARS) {
        return sendJson(res, 400, {
          answer: "Please keep your question under 500 characters.",
        });
      }

      // ✅ Only block truly obvious nonsense
      if (isClearlyOffTopic(question)) {
        return sendJson(res, 200, { answer: BASE_REFUSAL });
      }

      const result = await askDeepSeek(question, cardFront, cardBack);

      return sendJson(res, 200, { answer: result.answer });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[chat-server] Handler error:", message);
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
      return sendJson(res, 500, {
        error: "Failed to generate response.",
        details: message,
      });
    }
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[chat-server] Port ${PORT} is already in use (another \`npm run api\` or app is running).\n` +
        `  Stop it, or set PORT in .env to a free port (and match Vite's proxy in vite.config.ts if you change it).\n` +
        `  Find PID:  lsof -i :${PORT}   or   ss -tlnp | grep ${PORT}\n` +
        `  Kill:     kill <PID>   or   fuser -k ${PORT}/tcp`,
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Chat API listening on http://localhost:${PORT}`);
});