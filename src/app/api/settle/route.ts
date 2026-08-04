import { NextResponse } from "next/server";
import { getConnection, explorerTx } from "@/lib/solana";
import {
  LESSON_PRICE_USDC,
  TREASURY,
  USDC_DEVNET_MINT,
  verifySettlement,
} from "@/lib/payments";

export const runtime = "nodejs";
export const maxDuration = 45;

export async function GET() {
  return NextResponse.json({
    cluster: "devnet",
    treasury: TREASURY.toBase58(),
    mint: USDC_DEVNET_MINT.toBase58(),
    lessonPrice: LESSON_PRICE_USDC,
    decimals: 6,
  });
}

/**
 * Turns a funding signature into lesson credit. Nothing the client claims is
 * taken at face value: the amount is read from the cluster's own token balance
 * deltas, and the number of lessons granted is derived from that.
 */
export async function POST(request: Request) {
  let body: { signature?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const signature = body.signature?.trim();
  if (!signature) {
    return NextResponse.json({ error: "Pass the funding signature." }, { status: 400 });
  }

  try {
    const result = await verifySettlement(
      getConnection(),
      signature,
      LESSON_PRICE_USDC
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 422 });
    }

    return NextResponse.json({
      ok: true,
      funded: result.amount,
      lessons: Math.floor(result.amount / LESSON_PRICE_USDC),
      from: result.from,
      slot: result.slot,
      explorer: explorerTx(signature),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Settlement check failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
