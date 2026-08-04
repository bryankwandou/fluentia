import { NextResponse } from "next/server";
import { anchorCredential, getRegistrar, explorerAddress } from "@/lib/solana";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const registrar = getRegistrar();
  return NextResponse.json({
    ready: Boolean(registrar),
    registrar: registrar?.publicKey.toBase58() ?? null,
    explorer: registrar ? explorerAddress(registrar.publicKey.toBase58()) : null,
    cluster: "devnet",
  });
}

export async function POST(request: Request) {
  let body: {
    learner?: string;
    track?: string;
    level?: string;
    score?: number;
    transcript?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const learner = body.learner?.trim();
  if (!learner) {
    return NextResponse.json(
      { error: "Connect a wallet before minting a credential." },
      { status: 400 }
    );
  }

  const score = Number(body.score ?? 0);
  if (!Number.isFinite(score) || score < 60) {
    return NextResponse.json(
      { error: "Credentials are issued from a score of 60 upward." },
      { status: 422 }
    );
  }

  try {
    const result = await anchorCredential({
      learner,
      track: body.track ?? "Mandarin Chinese",
      level: body.level ?? "HSK 1",
      score,
      transcript: body.transcript ?? "",
      issuedAt: new Date().toISOString(),
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Devnet write failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
