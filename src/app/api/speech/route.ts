import { NextResponse } from "next/server";
import { AUDIO_MODEL, CHAT_MODEL, getGroq, gradingSystemPrompt, safeJson } from "@/lib/groq";
import { scoreTones, tonesFromPinyin, type MandarinTone } from "@/lib/pitch";

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

export type ToneReport = {
  overall: number;
  perSyllable: { tone: number; name: string; score: number }[];
  measured: true;
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
 * Three inputs decide the mark.
 *
 * Whisper turns the recording into text. The examiner model judges what was
 * said. And for tonal languages the pitch contour measured in the browser is
 * compared against the expected tone sequence arithmetically — no model
 * involved — because a transcript has already discarded the pitch that tone
 * actually lives in. When that measurement exists it overrides whatever the
 * model guessed.
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
  const expectedPinyin = String(form.get("expectedPinyin") ?? "");

  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "No recording was attached." }, { status: 400 });
  }
  if (audio.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "Recording exceeds 20 MB." }, { status: 413 });
  }

  const contour = parseNumbers(form.get("contour"));
  const medianHz = Number(form.get("medianHz") ?? 0);
  const voicedRatio = Number(form.get("voicedRatio") ?? 0);
  const voicedMs = Number(form.get("voicedMs") ?? 0);

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
        tones: null,
      });
    }

    const isTonal = /mandarin|chinese|cantonese|vietnamese|thai/i.test(track);
    const expectedTones: MandarinTone[] = isTonal
      ? tonesFromPinyin(expectedPinyin)
      : [];
    const tones =
      expectedTones.length > 0 && contour.length > 0
        ? scoreTones(contour, expectedTones)
        : null;

    const measurement = describeMeasurement({
      medianHz,
      voicedRatio,
      voicedMs,
      tones,
    });

    const completion = await groq.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: gradingSystemPrompt(track, level) },
        {
          role: "user",
          content: [
            `Target line: ${prompt || "(open practice, no fixed line)"}`,
            expectedPinyin ? `Expected pinyin: ${expectedPinyin}` : "",
            `What the learner said: ${spoken}`,
            measurement,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });

    const grade = safeJson<Grade>(
      completion.choices[0]?.message?.content ?? "",
      FALLBACK
    );

    // The measured tone score is arithmetic, so it wins. The composite is
    // recomputed to keep the headline number consistent with its parts.
    if (tones) {
      grade.tone = tones.overall;
      grade.score = Math.round(
        grade.accuracy * 0.35 +
          grade.pronunciation * 0.2 +
          tones.overall * 0.3 +
          grade.fluency * 0.15
      );
    }

    return NextResponse.json({
      transcript: spoken,
      grade,
      tones: tones ? { ...tones, measured: true as const } : null,
      voice: { medianHz, voicedRatio, voicedMs },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream failure.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function parseNumbers(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return [];
  return value
    .split(",")
    .map(Number)
    .filter((entry) => Number.isFinite(entry));
}

function describeMeasurement({
  medianHz,
  voicedRatio,
  voicedMs,
  tones,
}: {
  medianHz: number;
  voicedRatio: number;
  voicedMs: number;
  tones: ReturnType<typeof scoreTones>;
}) {
  if (!medianHz) return "";

  const lines = [
    "",
    "Acoustic measurements taken from the raw recording, not inferred:",
    `- median pitch ${medianHz} Hz`,
    `- voiced for ${voicedMs} ms, ${Math.round(voicedRatio * 100)}% of the clip`,
  ];

  if (tones) {
    lines.push(
      `- measured tone accuracy ${tones.overall}/100`,
      ...tones.perSyllable.map(
        (entry, index) =>
          `  syllable ${index + 1}, expected ${entry.name} tone: ${entry.score}/100`
      ),
      "Use the measured tone figures as given. Do not restate them as your own",
      "estimate, and make your correction address the weakest syllable above."
    );
  }

  return lines.join("\n");
}
