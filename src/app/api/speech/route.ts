import { NextResponse } from "next/server";
import { AUDIO_MODEL, CHAT_MODEL, getGroq, gradingSystemPrompt, safeJson } from "@/lib/groq";

export const runtime = "nodejs";
export const maxDuration = 60;

export type Grade = {
  score: number;
  accuracy: number;
  pronunciation: number;
  tone: number;
  fluency: number;
  verdict: string;
  fix: string;
  nextPrompt: string;
  nextPromptRoman: string;
  nextPromptGloss: string;
};

const FALLBACK: Grade = {
  score: 0,
  accuracy: 0,
  pronunciation: 0,
  tone: 0,
  fluency: 0,
  verdict: "The examiner could not read that attempt.",
  fix: "Record again somewhere quieter and speak a little slower.",
  nextPrompt: "",
  nextPromptRoman: "",
  nextPromptGloss: "",
};

/**
 * Two hops: Whisper turns the recording into text, then the examiner model
 * scores that text against the prompt the learner was given.
 */
export async function POST(request: Request) {
  const groq = getGroq();
  if (!groq) {
    return NextResponse.json(
      { error: "Speech grading is offline: GROQ_API_KEY is missing." },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const audio = form.get("audio");
  const track = String(form.get("track") ?? "Mandarin Chinese");
  const level = String(form.get("level") ?? "HSK 1");
  const prompt = String(form.get("prompt") ?? "");

  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "No recording was attached." }, { status: 400 });
  }
  if (audio.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Recording exceeds 20 MB." }, { status: 413 });
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: AUDIO_MODEL,
      response_format: "json",
      temperature: 0,
    });

    const spoken = (transcription as { text?: string }).text?.trim() ?? "";
    if (!spoken) {
      return NextResponse.json({
        transcript: "",
        grade: { ...FALLBACK, verdict: "Nothing audible came through." },
      });
    }

    const completion = await groq.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: gradingSystemPrompt(track, level) },
        {
          role: "user",
          content: `Target line: ${prompt || "(open practice, no fixed line)"}\nWhat the learner said: ${spoken}`,
        },
      ],
    });

    const grade = safeJson<Grade>(
      completion.choices[0]?.message?.content ?? "",
      FALLBACK
    );

    return NextResponse.json({ transcript: spoken, grade });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream failure.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
