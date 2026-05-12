# CURA

**AI-powered medical study platform that brings clinical context to spaced-repetition flashcards.**

CURA is a React application built to address a specific pain point in medical education: students using Anki flashcards constantly switch between tabs, textbooks, and YouTube to understand the drug, anatomy, or clinical concept being tested on a single card. CURA pulls that supplemental context into the study session itself, alongside adaptive practice questions, personalized study schedules, and an AI study assistant.

Built at a hackathon (PiHacks) after consulting medical professionals who had recently completed med school about the pain points they experienced while studying. Originally prototyped under the working name "AXON" before being renamed CURA.

## Features

### Anki Study Tab

Enhanced flashcard study sessions with a customizable sidebar that surfaces context the student would otherwise have to look up manually:

- **Card Overview** — definitions and explanations of key concepts on the current flashcard
- **Drugs** — pharmacological details (Generic Name, Mechanism of Action, Indications, Contraindications, Adverse Effects, Dosage, Drug Interactions) for any drug referenced
- **Anatomy** — interactive anatomical diagrams; users can rotate and explore structures
- **Clinical Relevance** — explains why a structure or concept matters in real-world practice

Users rate confidence as Easy / Medium / Hard after each card to guide spaced repetition, and can toggle which sidebar panels are visible.

### Practice Tab

Adaptive multiple-choice question generation that prioritizes topics the user has previously missed. After each set, missed topics automatically trigger follow-up questions on the same subject, creating a feedback loop that targets weak spots.

### Schedule Tab

Personalized study schedule builder. Given a name, total card count, and target completion date, it generates a full plan with total cards, study days, average cards per day, and a recommended daily range. Daily completion tracking is saved automatically, and schedules can be exported as PDFs via jsPDF.

### CURA Study Assistant

Built-in AI chatbot available throughout the app for real-time, context-aware questions about the current flashcard — no tab-switching required.

## Tech Stack

- **Frontend:** Vite, React 18, TypeScript
- **UI:** shadcn/ui (Radix UI primitives), Material UI, Tailwind CSS, Lucide icons, Motion
- **3D:** Three.js, React Three Fiber, drei
- **Data viz / utilities:** Recharts, react-dnd, react-hook-form, react-router, jsPDF
- **Backend:** Node.js (custom chat server)
- **AI:** DeepSeek API
- **Design:** Figma (full UI/UX designed before implementation)
- **Development tools:** Cursor, Claude

## Getting Started

The repo includes both a Vite frontend and a small Node backend that proxies chat requests to DeepSeek.

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and set your `DEEPSEEK_API_KEY`. The frontend reads `VITE_CHAT_API_URL`, which defaults to `http://localhost:8787`.

3. Start both the chat backend and frontend concurrently:

   ```
   npm run dev:all
   ```

   Or run them separately:

   ```
   npm run api    # chat backend on http://localhost:8787
   npm run dev    # frontend on Vite's default port
   ```

## What's Next

- Personalized performance analytics dashboards (mastery trends, weak subject areas, study streaks)
- Voice-mode study sessions for hands-free review
- Expanded anatomy library with more body systems
- Collaborative study features (shared schedules, group quizzes)
- Content packs targeting USMLE Step 1 and Step 2
