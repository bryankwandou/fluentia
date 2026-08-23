"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Result = {
  found: boolean;
  signature?: string;
  slot?: number;
  blockTime?: number | null;
  record?: Record<string, unknown> | null;
  explorer?: string;
  error?: string;
};

const FIELD_LABELS: Record<string, string> = {
  p: "Record format",
  l: "Learner wallet",
  t: "Language",
  v: "Level cleared",
  s: "Score",
  h: "Attempt fingerprint",
  d: "Issued at",
};

export function VerifyPanel() {
  const [signature, setSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [registrar, setRegistrar] = useState<{ registrar: string | null; explorer: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/credential")
      .then((response) => response.json())
      .then(setRegistrar)
      .catch(() => setRegistrar(null));
  }, []);

  async function check(event: React.FormEvent) {
    event.preventDefault();
    const value = signature.trim();
    if (!value) return;

    setBusy(true);
    setResult(null);

    try {
      const response = await fetch(`/api/verify?signature=${encodeURIComponent(value)}`);
      setResult(await response.json());
    } catch {
      setResult({ found: false, error: "The lookup could not reach devnet." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 sm:p-7">
      <h2 className="text-lg font-medium">Check a credential</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Paste any transaction signature issued by Fluentia. The record is read
        straight off devnet, not out of our database, so nobody here can edit
        what comes back.
      </p>

      <form onSubmit={check} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          value={signature}
          onChange={(event) => setSignature(event.target.value)}
          placeholder="Transaction signature"
          spellCheck={false}
          className="flex-1 rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 font-mono text-[12.5px] outline-none transition-colors placeholder:font-sans placeholder:text-muted/60 focus:border-jade-400/50"
        />
        <button
          type="submit"
          disabled={busy || !signature.trim()}
          className="btn btn-primary px-5 py-2.5 text-sm"
        >
          {busy ? "Reading chain…" : "Verify"}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.signature ?? "miss"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5"
          >
            {result.found && result.record ? (
              <div className="rounded-xl border border-jade-400/30 bg-jade-500/8 p-5">
                <p className="text-sm text-jade-300">
                  Confirmed at slot {result.slot?.toLocaleString("en-US")}
                  {result.blockTime
                    ? ` · ${new Date(result.blockTime * 1000).toUTCString()}`
                    : ""}
                </p>

                <dl className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {Object.entries(result.record).map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-line bg-ink-950/50 px-3 py-2">
                      <dt className="text-[11px] uppercase tracking-[0.12em] text-muted/70">
                        {FIELD_LABELS[key] ?? key}
                      </dt>
                      <dd className="mt-0.5 break-all font-mono text-[12.5px] text-paper/90">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {result.explorer && (
                  <a
                    href={result.explorer}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm text-jade-300 underline underline-offset-4"
                  >
                    Inspect the raw transaction
                  </a>
                )}
              </div>
            ) : (
              <p className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">
                {result.error ?? "No Fluentia record sits behind that signature."}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {registrar?.registrar && (
        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted/70">
          Credentials are countersigned by the registrar wallet{" "}
          <a
            href={registrar.explorer ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-muted underline underline-offset-4 hover:text-paper"
          >
            {registrar.registrar}
          </a>
          . Anything not signed by that key is not ours.
        </p>
      )}
    </div>
  );
}
