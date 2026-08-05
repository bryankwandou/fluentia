import { NextResponse } from "next/server";
import { CHAT_MODEL, getGroq, tutorSystemPrompt } from "@/lib/groq";
import { syllabusFor } from "@/lib/modules";

export const runtime = "nodejs";
export const maxDuration = 30;

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const groq = getGroq();
  if (!groq) {
    return NextResponse.json(
      { error: "The tutor is offline: GROQ_API_KEY is missing." },
      { status: 503 }
    );
  }

  let body: {
    track?: string;
    level?: string;
    age?: string;
    messages?: Turn[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const track = body.track ?? "Mandarin Chinese";
  const level = body.level ?? "HSK 1";
  const age = body.age ?? "adult";
  const history = (body.messages ?? []).slice(-14);

  if (history.length === 0) {
    return NextResponse.json({ error: "No messages supplied." }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.6,
      max_tokens: 400,
      messages: [
        { role: "system", content: tutorSystemPrompt(track, level, age, syllabusFor(level)) },
        ...history,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply, model: CHAT_MODEL });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream failure.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
