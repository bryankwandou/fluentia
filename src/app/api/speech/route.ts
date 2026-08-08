import { NextResponse } from "next/server";
import { AUDIO_MODEL, CHAT_MODEL, getGroq, gradingSystemPrompt, safeJson } from "@/lib/groq";
import {
  scoreTones,
  tonesFromJyutping,
  tonesFromPinyin,
  type ToneSystem,
} from "@/lib/pitch";

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
 * Which tone table applies. Cantonese carries six tones written in jyutping;
 * everything else tonal we teach is scored against Mandarin's five. A track we
 * have no table for returns nothing rather than being scored against the wrong
 * one, which would hand out marks that mean nothing.
 */
function toneSystemFor(track: string): ToneSystem | null {
  if (/cantonese|yue/i.test(track)) return "cantonese";
  if (/mandarin|chinese|putonghua/i.test(track)) return "mandarin";
  return null;
}

/**
 * Three inputs decide the mark.
 *
 * Whisper turns the recording into text. The examiner model judges what was
 * said. And for tonal languages the pitch contour measured in the browser is
 * compared against the expected tone sequence arithmetically — no model
 * involved — because a transcript has already discarded the pitch that tone
 * actually lives in. When that measurement exists it overrides whatever the
 * model guessed.
 *
 * The tone figure is worked out before anything is sent upstream, and survives
 * an upstream failure. A rate limit on the examiner is not a reason to throw
 * away a measurement that never needed the examiner in the first place.
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

  // Measured first, from the form alone. Nothing below can take this away.
  const system = toneSystemFor(track);
  const expectedTones = system
    ? system === "cantonese"
      ? tonesFromJyutping(expectedPinyin)
      : tonesFromPinyin(expectedPinyin)
    : [];
  const tones =
    system && expectedTones.length > 0 && contour.length > 0
      ? scoreTones(contour, expectedTones, system)
      : null;

  const toneReport = tones ? { ...tones, measured: true as const } : null;

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
        tones: toneReport,
      });
    }

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
      tones: toneReport,
      voice: { medianHz, voicedRatio, voicedMs },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream failure.";

    // The examiner is unreachable — usually a rate limit. If pitch was measured
    // the round is still worth something: the tone mark stands on its own, and
    // returning it lets the learner's schedule advance on the one part of the
    // grade that was never a guess. Without a measurement there is nothing
    // honest left to report, so the failure is passed through.
    if (toneReport) {
      return NextResponse.json({
        transcript: "",
        degraded: true,
        reason: rateLimited(message)
          ? "The examiner is over its quota for now, so only the tone measurement was scored."
          : "The examiner could not be reached, so only the tone measurement was scored.",
        grade: {
          ...FALLBACK,
          tone: toneReport.overall,
          score: toneReport.overall,
          verdict:
            "Graded on pitch alone. Tones were measured from the recording; " +
            "wording and fluency were not marked this round.",
          fix: weakestSyllable(toneReport),
        },
        tones: toneReport,
        voice: { medianHz, voicedRatio, voicedMs },
      });
    }

    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function rateLimited(message: string) {
  return /429|rate.?limit|quota/i.test(message);
}

/** Names the syllable that cost the most, so a degraded round still teaches. */
function weakestSyllable(report: ToneReport) {
  const worst = report.perSyllable.reduce((low, entry) =>
    entry.score < low.score ? entry : low
  );
  const place = report.perSyllable.indexOf(worst) + 1;
  return `Syllable ${place} scored ${worst.score} against a ${worst.name} tone. Take that one again on its own.`;
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
