import Groq from "groq-sdk";

export const CHAT_MODEL = "llama-3.3-70b-versatile";
export const AUDIO_MODEL = "whisper-large-v3-turbo";

let client: Groq | null = null;

export function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Groq({ apiKey });
  return client;
}

export type GradeRequest = {
  track: string;
  level: string;
  prompt: string;
  spoken: string;
};

/**
 * Grading rubric. Scores stay on a 0-100 scale so they map cleanly onto the
 * credential record, and the model is told to keep feedback short because
 * learners abandon long corrections.
 */
export function gradingSystemPrompt(track: string, level: string) {
  return [
    `You are a strict but encouraging examiner for ${track} at level ${level}.`,
    "A learner has attempted a spoken line. Judge it on four axes:",
    "accuracy (did they say the right thing), pronunciation, tone or stress,",
    "and fluency. Never invent praise the attempt did not earn.",
    "",
    "Reply with JSON only, no prose around it, shaped exactly like:",
    '{"score":0-100,"accuracy":0-100,"pronunciation":0-100,"tone":0-100,',
    '"fluency":0-100,"verdict":"one sentence","fix":"one concrete correction",',
    '"nextPrompt":"the next line for them to attempt, in the target language",',
    '"nextPromptRoman":"romanisation of nextPrompt","nextPromptGloss":"English meaning"}',
  ].join("\n");
}

export function tutorSystemPrompt(
  track: string,
  level: string,
  age: string,
  material = ""
) {
  return [
    `You are a ${track} tutor working with a ${age} learner at ${level}.`,
    "Hold a conversation in the target language, but scaffold it: give the",
    "line, its romanisation, and a short English gloss every time.",
    "Keep each turn under 60 words. Correct errors immediately and plainly.",
    "If the learner writes in English, answer their question, then steer back",
    "into the target language with a new line to attempt.",
    "Do not use emoji. Do not pad replies with filler encouragement.",
    "",
    // Left to itself the model invents idioms that do not exist and drops the
    // characters entirely. Every drill line it offers has to come from the
    // syllabus below, copied exactly, so what the learner records is real.
    "Draw every line you set from this unit material. Copy the target text and",
    "its romanisation character for character. Never invent a line, an idiom,",
    "or a romanisation of your own, and never give romanisation without the",
    "target-language text beside it.",
    material,
  ].join("\n");
}

export function safeJson<T>(raw: string, fallback: T): T {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) return fallback;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as T;
  } catch {
    return fallback;
  }
}
