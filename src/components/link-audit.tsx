"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIT } from "@/copy/proof";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Build = {
  commit: string;
  branch: string;
  chatModel: string;
  audioModel: string;
};

type Failure = { path: string; status: number };

type State = {
  phase: "loading" | "running" | "done" | "error";
  total: number;
  checked: number;
  failures: Failure[];
  message?: string;
};

/** Six at a time: enough to finish in seconds, few enough to look like a reader. */
const LANES = 6;

/**
 * Checks every catalogue address from the visitor's own browser.
 *
 * The complaint that started this was that the modules were not clickable. A
 * sentence on a page saying they are would be the same kind of claim that was
 * already disbelieved, so this makes the request instead: it pulls the address
 * list from /api/catalogue, asks for each one, and reports what came back. The
 * work happens on the reader's machine, against the deployment they are looking
 * at, and it names anything that fails rather than rounding it away.
 *
 * It starts on its own. Requiring a click to see the evidence puts a barrier in
 * front of exactly the person who needs it.
 */
export function LinkAudit({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = AUDIT[locale].widget;

  const [state, setState] = useState<State>({
    phase: "loading",
    total: 0,
    checked: 0,
    failures: [],
  });
  const [build, setBuild] = useState<Build | null>(null);
  const [sample, setSample] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);

  // React runs effects twice in development. Without this the audit would
  // start, restart, and report doubled counts to whoever is reading them.
  const started = useRef(false);

  const audit = useCallback(async () => {
    const began = performance.now();

    let paths: string[];
    try {
      const response = await fetch("/api/catalogue");
      const body = await response.json();
      paths = body.destinations as string[];
      if (!Array.isArray(paths) || paths.length === 0) {
        throw new Error("the catalogue returned no addresses");
      }
    } catch (cause) {
      setState({
        phase: "error",
        total: 0,
        checked: 0,
        failures: [],
        message: `could not read the address list: ${String(cause)}`,
      });
      return;
    }

    // Eleven links spread across the list, offered for checking by hand. A
    // reader who trusts none of the above can still click these.
    const step = Math.max(1, Math.floor(paths.length / 11));
    setSample(paths.filter((_, index) => index % step === 0).slice(0, 11));

    setState({ phase: "running", total: paths.length, checked: 0, failures: [] });

    const queue = [...paths];
    const failures: Failure[] = [];
    let checked = 0;

    const lane = async () => {
      for (let path = queue.shift(); path; path = queue.shift()) {
        let status = 0;
        try {
          const response = await fetch(path, { redirect: "follow" });
          status = response.status;
        } catch {
          status = 0;
        }
        if (status !== 200) failures.push({ path, status });
        checked++;
        setState((previous) => ({
          ...previous,
          checked,
          failures: [...failures],
        }));
      }
    };

    await Promise.all(Array.from({ length: LANES }, lane));

    setElapsed((performance.now() - began) / 1000);
    setState({
      phase: "done",
      total: paths.length,
      checked,
      failures: [...failures],
    });
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    fetch("/api/build")
      .then((response) => response.json())
      .then(setBuild)
      .catch(() => setBuild(null));

    void audit();
  }, [audit]);

  const { phase, total, checked, failures } = state;
  const passed = phase === "done" && failures.length === 0;
  const percent = total ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-medium">{copy.heading}</h2>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[11px]",
            phase === "done" && passed && "bg-jade-500/10 text-jade-300",
            phase === "done" && !passed && "bg-red-500/10 text-red-300",
            phase !== "done" && "bg-white/5 text-muted"
          )}
        >
          {phase === "loading" && copy.reading}
          {phase === "running" && copy.of(checked, total)}
          {phase === "error" && copy.cannotRun}
          {phase === "done" && (passed ? copy.pass : copy.failed(failures.length))}
        </span>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-muted">{copy.blurb}</p>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/8">
        <div
          className={cn(
            "h-full transition-[width] duration-300 ease-out",
            passed || phase !== "done" ? "bg-jade-400" : "bg-red-400"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {[
          [copy.addresses, total ? String(total) : "-"],
          [copy.answered, String(checked - failures.length)],
          [copy.didNot, String(failures.length)],
          [copy.took, elapsed ? `${elapsed.toFixed(1)}s` : "-"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted/70">
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {failures.length > 0 && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/[0.06] p-4">
          <p className="text-sm font-medium text-red-200">{copy.failureHeading}</p>
          <ul className="mt-3 space-y-1.5">
            {failures.map((failure) => (
              <li key={failure.path} className="text-[13px] tabular-nums text-muted">
                <span className="text-red-300">{failure.status || copy.noReply}</span>
                {"  "}
                {failure.path}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.message && (
        <p className="mt-6 text-sm text-red-300">{state.message}</p>
      )}

      {sample.length > 0 && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm text-muted">{copy.sample}</p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {sample.map((path) => (
              <a
                key={path}
                href={path}
                className="rounded-lg border border-line px-2.5 py-1.5 text-[12px] text-muted transition-colors hover:border-jade-400/40 hover:text-paper"
              >
                {path}
              </a>
            ))}
          </div>
        </div>
      )}

      {build && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-sm text-muted">
            {copy.servingA}{" "}
            <span className="text-paper">{build.commit.slice(0, 7)}</span> on{" "}
            <span className="text-paper">{build.branch}</span>, {copy.servingB}{" "}
            <span className="text-paper">{build.audioModel}</span>.{" "}
            {copy.servingC}
          </p>
        </div>
      )}
    </div>
  );
}
