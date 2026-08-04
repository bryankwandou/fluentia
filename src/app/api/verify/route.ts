import { NextResponse } from "next/server";
import { getConnection, explorerTx } from "@/lib/solana";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Reads a credential straight back off devnet. Anyone holding a signature can
 * call this without an account, which is the whole point of putting the record
 * on a public ledger rather than in our database.
 */
export async function GET(request: Request) {
  const signature = new URL(request.url).searchParams.get("signature")?.trim();
  if (!signature) {
    return NextResponse.json({ error: "Pass a ?signature= value." }, { status: 400 });
  }

  try {
    const connection = getConnection();
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return NextResponse.json(
        { found: false, error: "Devnet has no transaction under that signature." },
        { status: 404 }
      );
    }

    const memo = (tx.meta?.logMessages ?? [])
      .map((line) => line.match(/Program log: Memo \(len \d+\): "(.*)"$/)?.[1])
      .find(Boolean);

    if (!memo) {
      return NextResponse.json(
        { found: false, error: "That transaction carries no Fluentia record." },
        { status: 422 }
      );
    }

    let record: Record<string, unknown> | null = null;
    try {
      record = JSON.parse(memo.replace(/\\"/g, '"'));
    } catch {
      record = null;
    }

    return NextResponse.json({
      found: true,
      signature,
      slot: tx.slot,
      blockTime: tx.blockTime,
      raw: memo,
      record,
      explorer: explorerTx(signature),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
