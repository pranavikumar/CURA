import { NextResponse } from "next/server";

type PracticeQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type StudyDataPayload = {
  drugs: Record<
    string,
    {
      name: string;
      genericName: string;
      class: string;
      mechanism: string;
      indications: string[];
      contraindications: string[];
      adverseEffects: string[];
      dosage: string;
      interactions: string[];
    }
  >;
  diseases: Record<
    string,
    {
      name: string;
      symptoms: string[];
      pathophysiology: string;
      diagnosis: string;
      treatment: string;
    }
  >;
  cards: Array<{
    id: string;
    front: string;
    back: string;
    tags: string[];
    difficulty: number;
  }>;
  anatomyModels: Record<
    string,
    {
      id: string;
      name: string;
      description: string;
      clinicalRelevance: string;
      structures: Array<{
        name: string;
        description: string;
        clinicalPearl: string;
      }>;
    }
  >;
  practiceQuestionsByCard: Record<string, PracticeQuestion[]>;
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  };
}

const SYSTEM_PROMPT = `
You are generating high-quality medical study data for an educational app.
Return STRICT JSON only (no markdown, no code fences) with this exact top-level shape:
{
  "drugs": Record<string, DrugInfo>,
  "diseases": Record<string, DiseaseInfo>,
  "cards": AnkiCard[],
  "anatomyModels": Record<string, AnatomyModel>,
  "practiceQuestionsByCard": Record<string, PracticeQuestion[]>
}

Required types:
DrugInfo = {
  name: string;
  genericName: string;
  class: string;
  mechanism: string;
  indications: string[];
  contraindications: string[];
  adverseEffects: string[];
  dosage: string;
  interactions: string[];
}
DiseaseInfo = {
  name: string;
  symptoms: string[];
  pathophysiology: string;
  diagnosis: string;
  treatment: string;
}
AnkiCard = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: number; // integer 0-3
}
AnatomyModel = {
  id: string;
  name: string;
  description: string;
  clinicalRelevance: string;
  structures: Array<{
    name: string;
    description: string;
    clinicalPearl: string;
  }>;
}
PracticeQuestion = {
  id: string;
  question: string;
  options: string[]; // exactly 4 options
  correctAnswer: number; // 0-3 index
  explanation: string;
}

Data constraints:
- Include at least 3 drugs, 3 diseases, 3 cards.
- Include anatomyModels for keys: "heart", "lung", "kidney".
- Every card id must exist in practiceQuestionsByCard with exactly 3 questions.
- Keep educational content concise but accurate.
- Use lowercase keys for drugs/diseases records.
`;

/** Strip optional ```json ... ``` wrappers if the model adds them. */
function extractJsonString(raw: string): string {
  const trimmed = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/m;
  const m = trimmed.match(fence);
  if (m) return m[1].trim();
  return trimmed;
}

/**
 * Models may prefix text ("Here is the JSON:") or add trailing text.
 * Take the outermost {...} block from the first `{` to the last `}`.
 */
function extractJsonObject(raw: string): string {
  const s = extractJsonString(raw).trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return s;
  }
  return s.slice(start, end + 1);
}

function normalizeData(raw: unknown): StudyDataPayload {
  const payload = raw as Partial<StudyDataPayload>;

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload object.");
  }
  if (!payload.drugs || !payload.diseases || !payload.cards || !payload.anatomyModels || !payload.practiceQuestionsByCard) {
    throw new Error("Missing one or more required top-level fields.");
  }

  return payload as StudyDataPayload;
}

/** DeepSeek uses OpenAI-compatible chat completions response shape. */
type DeepSeekChatResponse = {
  choices?: Array<{
    message?: { content?: string | null; role?: string };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string; code?: string };
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Missing DEEPSEEK_API_KEY. Create backend/.env.local with DEEPSEEK_API_KEY=your_key and restart `pnpm dev` in the backend folder.",
        code: "MISSING_API_KEY",
      },
      { status: 503, headers: corsHeaders() },
    );
  }

  let topic = "high-yield cardiology and internal medicine";
  try {
    const body = (await req.json()) as { topic?: string };
    if (body.topic && body.topic.trim()) topic = body.topic.trim();
  } catch {
    // Keep default topic for empty or invalid request bodies.
  }

  const userPrompt = `Generate a complete StudyData payload for this focus: ${topic}`;

  try {
    console.log("sending request to deepseek");
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 8192,
        messages: [
          { role: "system", content: SYSTEM_PROMPT.trim() },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    console.log("response from deepseek", response);

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `DeepSeek API request failed: ${response.status} ${responseText}` },
        { status: 502, headers: corsHeaders() },
      );
    }

    let apiJson: DeepSeekChatResponse;
    try {
      apiJson = JSON.parse(responseText) as DeepSeekChatResponse;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from DeepSeek API (non-JSON response).", preview: responseText.slice(0, 400) },
        { status: 502, headers: corsHeaders() },
      );
    }

    if (apiJson.error?.message) {
      return NextResponse.json(
        { error: apiJson.error.message, code: apiJson.error.code },
        { status: 502, headers: corsHeaders() },
      );
    }

    const rawContent = apiJson.choices?.[0]?.message?.content;
    if (rawContent == null || rawContent === "") {
      return NextResponse.json(
        { error: "DeepSeek returned empty content.", detail: responseText.slice(0, 500) },
        { status: 502, headers: corsHeaders() },
      );
    }

    const jsonString = extractJsonObject(rawContent);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return NextResponse.json(
        {
          error: "DeepSeek response was not valid JSON.",
          preview: jsonString.slice(0, 800),
        },
        { status: 502, headers: corsHeaders() },
      );
    }

    console.log("returning deepseek response", parsed);

    try {
      const data = normalizeData(parsed);
      return NextResponse.json(data, { headers: corsHeaders() });
    } catch (e) {
      return NextResponse.json(
        {
          error: e instanceof Error ? e.message : "Payload validation failed.",
          hint: "Expected top-level keys: drugs, diseases, cards, anatomyModels, practiceQuestionsByCard.",
          preview: JSON.stringify(parsed).slice(0, 600),
        },
        { status: 422, headers: corsHeaders() },
      );
    }
  } catch (error) {
    console.error("[study-content]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown server error",
        hint: "Check that the Next backend is running (`cd backend && pnpm dev`) and DEEPSEEK_API_KEY is set.",
      },
      { status: 500, headers: corsHeaders() },
    );
  }
}
