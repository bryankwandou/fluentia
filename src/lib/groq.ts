import Groq from "groq-sdk";

/**
 * Hosted models get retired, and when one does every call fails with a 404 that
 * looks nothing like an outage. llama-3.3-70b-versatile was withdrawn while it
 * was still named here: the tutor returned an error on every turn, the speech
 * grader quietly fell back to scoring pitch alone, and nothing said so. It
 * stayed that way for weeks because no test asked whether the model still
 * existed.
 *
 * model-proof checks these two names against the account's model list, so a
 * retirement now fails a suite instead of degrading the product in silence.
 */
export const CHAT_MODEL = "openai/gpt-oss-120b";
export const AUDIO_MODEL = "whisper-large-v3-turbo";

/**
 * gpt-oss thinks before it answers, and the thinking is billed against the same
 * max_tokens budget as the reply. On the default effort the grader spent
 * between 233 and 428 tokens of a 500 token budget reasoning about a two
 * syllable line; when it ran over, the reply came back with empty content and
 * the route reported the examiner as unreachable. The learner saw a tone-only
 * mark and no explanation, which is indistinguishable from the model being
 * withdrawn.
 *
 * Held at low effort the same call settles at 166 to 183 tokens, leaving the
 * budget to the answer. Both callers pass this, and both leave room to spare on
 * top of it.
 */
export const REASONING = { reasoning_effort: "low" } as const;

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
export function gradingSystemPrompt(
  track: string,
  level: string,
  // The learner reads the verdict in whichever language the site is being
  // read in. The attempt itself is still judged in the target language; only
  // the explanation of it moves.
  explain = "English"
) {
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
    '"nextPromptRoman":"romanisation of nextPrompt","nextPromptGloss":"the meaning"}',
    "",
    `Write verdict, fix and nextPromptGloss in ${explain}. The target-language`,
    "line itself stays in the target language, untranslated.",
  ].join("\n");
}

export function tutorSystemPrompt(
  track: string,
  level: string,
  age: string,
  material = "",
  // Same rule as the examiner: the scaffolding is for the learner, so it is
  // written in the language they are reading the site in.
  explain = "English"
) {
  return [
    `You are a ${track} tutor working with a ${age} learner at ${level}.`,
    "Hold a conversation in the target language, but scaffold it: give the",
    `line, its romanisation, and a short gloss in ${explain} every time.`,
    "Keep each turn under 60 words. Correct errors immediately and plainly.",
    `Explanations, corrections and asides go in ${explain}.`,
    `If the learner writes in ${explain}, answer their question, then steer`,
    "back into the target language with a new line to attempt.",
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
