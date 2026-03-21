import type { AnatomyModel, AnkiCard, DiseaseInfo, DrugInfo, PracticeQuestion } from "./mockData";

export interface StudyDataPayload {
  drugs: Record<string, DrugInfo>;
  diseases: Record<string, DiseaseInfo>;
  cards: AnkiCard[];
  anatomyModels: Record<string, AnatomyModel>;
  practiceQuestionsByCard: Record<string, PracticeQuestion[]>;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

export async function fetchStudyData(topic?: string): Promise<StudyDataPayload> {
  const response = await fetch(`${API_BASE_URL}/api/study-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: topic ?? "high-yield medical board prep" }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      body && typeof body === "object" && "error" in body
        ? String((body as { error: unknown }).error)
        : response.statusText;
    throw new Error(`Study API failed (${response.status}): ${detail}`);
  }

  return body as StudyDataPayload;
}
