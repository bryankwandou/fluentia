"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  LESSON_PRICE_USDC,
  buildFundingTransaction,
  readUsdcBalance,
} from "@/lib/payments";
import { shortAddress } from "@/lib/utils";

type Injected = {
  isPhantom?: boolean;
  publicKey?: { toString(): string } | null;
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction<T>(transaction: T): Promise<T>;
};

function injected(): Injected | null {
  if (typeof window === "undefined") return null;
  const candidate =
    (window as unknown as { solana?: Injected; solflare?: Injected }).solana ??
    (window as unknown as { solflare?: Injected }).solflare;
  return candidate ?? null;
}

const RPC = process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";

export function WalletPanel({
  onAddress,
  onCredit,
}: {
  onAddress?: (address: string) => void;
  onCredit?: (lessons: number) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState(2.5);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ lessons: number; explorer: string } | null>(null);

  const refresh = useCallback(async (owner: string) => {
    try {
      const connection = new Connection(RPC, "confirmed");
      setBalance(await readUsdcBalance(connection, new PublicKey(owner)));
    } catch {
      setBalance(null);
    }
  }, []);

  useEffect(() => {
    const wallet = injected();
    if (!wallet) return;
    wallet
      .connect({ onlyIfTrusted: true })
      .then((result) => {
        const key = result.publicKey.toString();
        setAddress(key);
        onAddress?.(key);
        refresh(key);
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  async function connect() {
    const wallet = injected();
    if (!wallet) {
      setError(
        "No Solana wallet was found in this browser. Install Phantom or Solflare, then set it to devnet."
      );
      return;
    }

    setError(null);
    setBusy("connect");
    try {
      const result = await wallet.connect();
      const key = result.publicKey.toString();
      setAddress(key);
      onAddress?.(key);
      await refresh(key);
    } catch {
      setError("The wallet refused the connection.");
    } finally {
      setBusy(null);
    }
  }

  async function fund() {
    const wallet = injected();
    if (!wallet || !address) return;

    setError(null);
    setNote(null);
    setReceipt(null);
    setBusy("fund");

    try {
      const connection = new Connection(RPC, "confirmed");
      const payer = new PublicKey(address);

      const held = await readUsdcBalance(connection, payer);
      if (held === null) {
        throw new Error(
          "This wallet holds no devnet USDC account yet. Acquire devnet USDC first, then fund a balance."
        );
      }
      if (held < amount) {
        throw new Error(
          `Balance is ${held.toFixed(2)} USDC, short of the ${amount.toFixed(2)} you asked to move.`
        );
      }

      const { transaction, blockhash, lastValidBlockHeight } =
        await buildFundingTransaction({ connection, payer, amount });

      setNote("Approve the transfer in your wallet.");
      const signed = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        (signed as typeof transaction).serialize()
      );

      setNote("Waiting for devnet to confirm.");
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      setNote("Confirming the credit against the ledger.");
      const response = await fetch("/api/settle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The credit could not be confirmed.");

      setReceipt({ lessons: data.lessons, explorer: data.explorer });
      onCredit?.(data.lessons);
      setNote(null);
      await refresh(address);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The transfer did not go through.");
      setNote(null);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">Balance</p>
          <p className="mt-1.5 text-sm text-muted">
            {LESSON_PRICE_USDC} USDC buys one completed lesson.
          </p>
        </div>
        {address && (
          <span className="rounded-lg border border-line px-2 py-1 font-mono text-[11px] text-muted">
            {shortAddress(address)}
          </span>
        )}
      </div>

      {!address ? (
        <button
          type="button"
          onClick={connect}
          disabled={busy === "connect"}
          className="mt-4 w-full rounded-xl bg-jade-400 px-4 py-2.5 text-sm font-medium text-ink-950 disabled:opacity-40"
        >
          {busy === "connect" ? "Waiting on the wallet…" : "Connect a devnet wallet"}
        </button>
      ) : (
        <>
          <div className="mt-4 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
            <p className="text-xs text-muted">Devnet USDC held</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums">
              {balance === null ? "no token account" : balance.toFixed(2)}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min={LESSON_PRICE_USDC}
              step={0.25}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-24 rounded-xl border border-line bg-white/[0.03] px-3 py-2.5 text-sm tabular-nums outline-none focus:border-jade-400/50"
            />
            <button
              type="button"
              onClick={fund}
              disabled={busy === "fund" || amount < LESSON_PRICE_USDC}
              className="flex-1 rounded-xl border border-jade-400/40 bg-jade-500/12 px-4 py-2.5 text-sm font-medium text-jade-300 disabled:opacity-35"
            >
              {busy === "fund" ? "Settling…" : `Fund ${Math.floor(amount / LESSON_PRICE_USDC)} lessons`}
            </button>
          </div>
        </>
      )}

      {note && <p className="mt-3 text-[12.5px] text-muted">{note}</p>}

      {receipt && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl border border-jade-400/30 bg-jade-500/8 p-3 text-[12.5px]"
        >
          <p className="text-jade-300">
            {receipt.lessons} lessons credited, confirmed against the ledger.
          </p>
          <a
            href={receipt.explorer}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-block text-jade-300 underline underline-offset-4"
          >
            View the transfer
          </a>
        </motion.div>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-coral/30 bg-coral/10 px-3 py-2.5 text-[12.5px] leading-relaxed text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
