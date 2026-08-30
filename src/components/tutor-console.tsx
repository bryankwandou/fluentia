"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScoreBar, ScoreDial } from "./score-dial";
import { WalletPanel } from "./wallet-panel";
import { CONSOLE } from "@/copy/console";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { ALL_MODULES, type Drill } from "@/lib/modules";
import { analyseBlob } from "@/lib/pitch";
import { PASS_MARK, buildQueue, cardId } from "@/lib/srs";
import { useReviews } from "@/lib/store";
import { cn, shortAddress } from "@/lib/utils";

type Turn = { role: "user" | "assistant"; content: string };

type Grade = {
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

type Anchor = {
  signature: string;
  digest: string;
  explorer: string;
};

type ToneReport = {
  overall: number;
  perSyllable: {
    tone: number;
    name: string;
    score: number;
    /** Tones held to the same target because pitch alone cannot split them. */
    sharedWith?: string[];
  }[];
  measured: true;
};

const LANGUAGES = [...TRACKS.map((track) => track.language), ...LONG_TAIL];
const FREE_ROUNDS = 3;

/** What the model is told to write its explanations in, per locale. */
const EXPLAIN: Record<Locale, string> = { en: "English", id: "Indonesian" };

export function TutorConsole({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const params = useSearchParams();
  const copy = CONSOLE[locale];
  const explain = EXPLAIN[locale];

  const [language, setLanguage] = useState(params.get("language") ?? "Mandarin Chinese");
  const [level, setLevel] = useState(params.get("level") ?? "HSK 1");
  const [age, setAge] = useState("an adult");

  const [messages, setMessages] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Something the learner should know that is not a failure. */
  const [notice, setNotice] = useState<string | null>(null);

  const [recording, setRecording] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [transcript, setTranscript] = useState("");
  const [targetLine, setTargetLine] = useState("");
  const [expectedPinyin, setExpectedPinyin] = useState("");
  const [tones, setTones] = useState<ToneReport | null>(null);

  const [rounds, setRounds] = useState(0);
  const [credits, setCredits] = useState(0);
  const [wallet, setWallet] = useState("");
  const [anchoring, setAnchoring] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  // The schedule lives in the browser and is driven by the measured score, so
  // a card the learner keeps fumbling comes back regardless of what they claim.
  const { reviews, ready: deckReady, record, reset: resetDeck, progress } = useReviews();

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const scroller = useRef<HTMLDivElement | null>(null);

  const track = TRACKS.find((entry) => entry.language === language);
  const levels = track?.levels.map((entry) => entry.code) ?? [
    "A1", "A2", "B1", "B2", "C1", "C2",
  ];

  useEffect(() => {
    if (!levels.includes(level)) setLevel(levels[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const stored = window.localStorage.getItem("fluentia.wallet");
    if (stored) setWallet(stored);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const next: Turn[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setDraft("");
    setThinking(true);
    setError(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ track: language, level, age, explain, messages: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? copy.errTutorSilent);

      setMessages([...next, { role: "assistant", content: data.reply }]);
      const line = firstTargetLine(data.reply);
      if (line) {
        setTargetLine(line);
        setExpectedPinyin("");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.errGeneric);
      setMessages(next);
    } finally {
      setThinking(false);
    }
  }

  async function toggleRecording() {
    if (recording) {
      recorder.current?.stop();
      return;
    }

    if (rounds >= FREE_ROUNDS && credits <= 0) {
      setError(copy.errRoundsSpent(FREE_ROUNDS));
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const instance = new MediaRecorder(stream, { mimeType: mime });
      chunks.current = [];

      instance.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      instance.onstop = async () => {
        stream.getTracks().forEach((audioTrack) => audioTrack.stop());
        setRecording(false);
        await grade_(new Blob(chunks.current, { type: mime }), mime);
      };

      recorder.current = instance;
      instance.start();
      setRecording(true);
    } catch {
      setError(copy.errMicRefused);
    }
  }

  async function grade_(blob: Blob, mime: string) {
    if (blob.size < 1200) {
      setError(copy.errTooShort);
      return;
    }

    setGrading(true);
    setGrade(null);
    setTones(null);
    setAnchor(null);
    setNotice(null);

    try {
      const form = new FormData();
      const extension = mime.includes("mp4") ? "m4a" : "webm";
      form.append("audio", new File([blob], `attempt.${extension}`, { type: mime }));
      form.append("track", language);
      form.append("level", level);
      form.append("prompt", targetLine);
      form.append("expectedPinyin", expectedPinyin);
      form.append("explain", explain);

      // Pitch is measured here, from the raw samples, because the transcript
      // the grader sees has already thrown it away.
      const pitch = await analyseBlob(blob);
      if (pitch && pitch.contour.length > 0) {
        form.append("contour", pitch.contour.join(","));
        form.append("medianHz", String(pitch.medianHz));
        form.append("voicedRatio", String(pitch.voicedRatio));
        form.append("voicedMs", String(pitch.voicedMs));
      }

      const response = await fetch("/api/speech", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? copy.errGrading);

      setTranscript(data.transcript ?? "");
      setGrade(data.grade as Grade);
      setTones((data.tones as ToneReport | null) ?? null);
      if (data.degraded) setNotice(String(data.reason ?? ""));

      // Only a set line earns a card. Open practice has nothing stable to key
      // a schedule on, and inventing an id per recording would fill the deck
      // with cards that can never come up again.
      const attempted = targetLine.trim();
      if (attempted && typeof data.grade?.score === "number") {
        record(cardId(language, attempted), data.grade.score);
      }

      setRounds((count) => count + 1);
      if (rounds >= FREE_ROUNDS) setCredits((value) => Math.max(0, value - 1));
      if (data.grade?.nextPrompt) {
        setTargetLine(data.grade.nextPrompt);
        setExpectedPinyin(data.grade.nextPromptRoman ?? "");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.errGrading);
    } finally {
      setGrading(false);
    }
  }

  async function mint() {
    if (!grade || !wallet) return;
    setAnchoring(true);
    setError(null);

    try {
      const response = await fetch("/api/credential", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          learner: wallet.trim(),
          track: language,
          level,
          score: grade.score,
          transcript,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? copy.errWriteRejected);
      setAnchor({ signature: data.signature, digest: data.digest, explorer: data.explorer });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.errDevnet);
    } finally {
      setAnchoring(false);
    }
  }

  const roundsLeft = Math.max(0, FREE_ROUNDS - rounds);

  // Drills carry numbered pinyin, which is what lets the tone checker know
  // which contour it should be measuring against.
  const moduleDrills: Drill[] = ALL_MODULES.filter(
    (module) => module.code === level
  ).flatMap((module) => module.units.flatMap((unit) => unit.drills));

  // The list the learner sees is the scheduler's queue, not the module's
  // running order: anything overdue is pulled to the top, and unseen lines
  // fill whatever room is left.
  const drillById = new Map(
    moduleDrills.map((drill) => [cardId(language, drill.target), drill])
  );
  const session = buildQueue(
    reviews.filter((review) => drillById.has(review.id)),
    moduleDrills.map((drill) => cardId(language, drill.target)),
    12
  ).flatMap((card) => {
    const drill = drillById.get(card.id);
    return drill ? [{ drill, card }] : [];
  });

  function pickDrill(drill: Drill) {
    setTargetLine(drill.target);
    setExpectedPinyin(drill.roman);
    setGrade(null);
    setTones(null);
    setError(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
      {/* ------------------------------------------------ conversation */}
      <div className="card flex min-h-[560px] flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <Select
            value={language}
            onChange={setLanguage}
            options={LANGUAGES.map((entry) => ({ value: entry, label: entry }))}
            label={copy.languageLabel}
          />
          <Select
            value={level}
            onChange={setLevel}
            options={levels.map((entry) => ({ value: entry, label: entry }))}
            label={copy.levelLabel}
          />
          {/* The value is what the model is told; only the label follows the
              locale, so switching language cannot quietly change who it
              thinks it is teaching. */}
          <Select value={age} onChange={setAge} options={copy.ages} label={copy.learnerLabel} />
          <span className="ml-auto text-xs text-muted">
            {roundsLeft > 0
              ? copy.freeLeft(roundsLeft)
              : credits > 0
                ? copy.paidLeft(credits)
                : copy.roundsSpent}
          </span>
        </div>

        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <p className="text-sm text-muted">{copy.openingPrompt(language)}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {[
                    copy.seedFirstLine(language),
                    copy.seedPlaceMe,
                    copy.seedTones,
                  ].map((seed) => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => send(seed)}
                      className="rounded-lg border border-line px-3 py-2 text-[13px] text-muted transition-colors hover:border-jade-400/50 hover:text-paper"
                    >
                      {seed}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((turn, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                    turn.role === "user"
                      ? "bg-jade-500/15 text-paper"
                      : "border border-line bg-white/[0.03] text-paper/90"
                  )}
                >
                  {turn.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {thinking && (
            <div className="flex gap-1.5 px-1">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-jade-400"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.16 }}
                />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.inputPlaceholder(language)}
            className="flex-1 rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-jade-400/50"
          />
          <button
            type="submit"
            disabled={thinking || !draft.trim()}
            className="btn btn-primary px-4 py-2.5 text-sm"
          >
            {copy.send}
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------- grading */}
      <div className="space-y-5">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
            {copy.speakingRound}
          </p>

          {session.length > 0 && (
            <div className="mt-3 max-h-40 space-y-1 overflow-y-auto pr-1">
              {session.map(({ drill, card }) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => pickDrill(drill)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] transition-colors",
                    targetLine === drill.target
                      ? "border-jade-400/50 bg-jade-500/10 text-paper"
                      : "border-line text-muted hover:border-white/20 hover:text-paper"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {drill.target}
                    {drill.roman && (
                      <span className="ml-2 text-[11px] text-jade-300/70">{drill.roman}</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]",
                      card.attempts === 0
                        ? "bg-white/6 text-muted/70"
                        : card.lastScore >= PASS_MARK
                          ? "bg-jade-500/15 text-jade-300"
                          : "bg-coral/15 text-coral"
                    )}
                  >
                    {card.attempts === 0
                      ? copy.cardNew
                      : card.lastScore >= PASS_MARK
                        ? `${card.lastScore}`
                        : copy.cardRelearn}
                  </span>
                </button>
              ))}
            </div>
          )}

          {targetLine ? (
            <div className="mt-3 rounded-xl border border-line bg-white/[0.03] p-3">
              <p className="text-[15px] leading-relaxed">{targetLine}</p>
              {expectedPinyin && (
                <p className="mt-1 text-[12.5px] text-jade-300/80">
                  {expectedPinyin} · {copy.measuredNotGuessed}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">{copy.noTargetYet}</p>
          )}

          <button
            type="button"
            onClick={toggleRecording}
            disabled={grading}
            className={cn(
              "relative mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50",
              recording
                ? "bg-coral text-ink-950"
                : "bg-jade-400 text-ink-950 hover:bg-jade-300"
            )}
          >
            {grading
              ? copy.marking
              : recording
                ? copy.stopAndSubmit
                : copy.recordAttempt}
          </button>

          {recording && (
            <div className="mt-3 flex items-center justify-center gap-1">
              {Array.from({ length: 18 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="w-1 rounded-full bg-jade-400/70"
                  animate={{ height: [4, 4 + Math.random() * 22, 4] }}
                  transition={{
                    duration: 0.6 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: index * 0.04,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {grade && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-5"
            >
              <div className="flex items-center gap-5">
                <ScoreDial value={grade.score} />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <ScoreBar label={copy.accuracy} value={grade.accuracy} />
                  <ScoreBar label={copy.pronunciation} value={grade.pronunciation} />
                  <ScoreBar label={copy.tone} value={grade.tone} />
                  <ScoreBar label={copy.fluency} value={grade.fluency} />
                </div>
              </div>

              {tones && (
                <div className="mt-4 rounded-xl border border-jade-400/25 bg-jade-500/[0.06] p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-jade-300/80">
                    {copy.pitchHeading}
                  </p>
                  <div className="mt-2.5 space-y-1.5">
                    {tones.perSyllable.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <span className="w-4 text-[11px] tabular-nums text-muted">
                          {index + 1}
                        </span>
                        <span className="w-20 text-[12px] text-muted">
                          {entry.name}
                          {/* A mark on one of a merged pair is not a verdict on
                              the pair. Saying so here is cheaper than letting a
                              learner read a good score as confirmation they hit
                              a distinction nothing measured. */}
                          {entry.sharedWith?.length ? (
                            <span
                              className="ml-1 cursor-help text-amber-300/70"
                              title={copy.sharedTitle(entry.sharedWith.join(" / "))}
                            >
                              ~
                            </span>
                          ) : null}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/6">
                          <motion.div
                            className="h-full rounded-full bg-jade-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.score}%` }}
                            transition={{ duration: 0.6, delay: index * 0.06 }}
                          />
                        </div>
                        <span className="w-7 text-right text-[12px] tabular-nums">
                          {entry.score}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* A title attribute never opens on a touch screen, so the
                      caveat is written out as well rather than hidden in a
                      hover the phone half of the traffic cannot reach. */}
                  {tones.perSyllable.some((entry) => entry.sharedWith?.length) && (
                    <p className="mt-2.5 border-t border-jade-400/15 pt-2 text-[11px] leading-relaxed text-muted">
                      {copy.sharedNote}
                    </p>
                  )}
                </div>
              )}

              {transcript && (
                <p className="mt-4 rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-[13px] text-muted">
                  {copy.heard} <span className="text-paper/85">{transcript}</span>
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-paper/90">
                {grade.verdict}
              </p>
              {grade.fix && (
                <p className="mt-2 text-[13px] leading-relaxed text-amber">
                  {grade.fix}
                </p>
              )}

              {grade.nextPrompt && (
                <div className="mt-4 rounded-xl border border-line bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted/70">
                    {copy.nextLine}
                  </p>
                  <p className="mt-1.5 text-[15px]">{grade.nextPrompt}</p>
                  {grade.nextPromptRoman && (
                    <p className="text-[13px] text-jade-300/80">{grade.nextPromptRoman}</p>
                  )}
                  {grade.nextPromptGloss && (
                    <p className="mt-0.5 text-[13px] text-muted">{grade.nextPromptGloss}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------ review deck */}
        {deckReady && progress.total > 0 && (
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
                {copy.deckHeading}
              </p>
              <button
                type="button"
                onClick={resetDeck}
                className="text-[11px] text-muted/60 underline underline-offset-4 transition-colors hover:text-muted"
              >
                {copy.clear}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                [copy.learning, progress.learning],
                [copy.retained, progress.mature],
                [copy.dueNow, progress.dueNow],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5"
                >
                  <p className="text-[19px] tabular-nums leading-none">{value}</p>
                  <p className="mt-1.5 text-[11px] text-muted">{label}</p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              {progress.meanScore
                ? copy.averaging(progress.meanScore, progress.total)
                : ""}
              {copy.schedule(PASS_MARK)}
            </p>
          </div>
        )}

        {/* ------------------------------------------------ credential */}
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
            {copy.anchorHeading}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{copy.anchorBlurb}</p>

          {wallet ? (
            <p className="mt-3 rounded-xl border border-line bg-white/[0.02] px-3 py-2 font-mono text-[12px] text-muted">
              {shortAddress(wallet, 8)}
            </p>
          ) : (
            <p className="mt-3 text-[12.5px] text-muted/70">{copy.connectWallet}</p>
          )}

          <button
            type="button"
            onClick={mint}
            disabled={!grade || grade.score < 60 || !wallet.trim() || anchoring}
            className="mt-3 w-full rounded-xl border border-jade-400/40 bg-jade-500/12 px-4 py-2.5 text-sm font-medium text-jade-300 transition-colors hover:bg-jade-500/20 disabled:opacity-35"
          >
            {anchoring ? copy.writing : copy.writeCredential}
          </button>

          {anchor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-jade-400/30 bg-jade-500/8 p-3 text-[12.5px]"
            >
              <p className="text-muted">{copy.confirmed}</p>
              <p className="mt-1.5 break-all font-mono text-jade-300">
                {shortAddress(anchor.signature, 10)}
              </p>
              <a
                href={anchor.explorer}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-jade-300 underline underline-offset-4"
              >
                {copy.openExplorer}
              </a>
            </motion.div>
          )}
        </div>

        <WalletPanel
          onAddress={(value) => {
            setWallet(value);
            window.localStorage.setItem("fluentia.wallet", value);
          }}
          onCredit={(lessons) => setCredits((value) => value + lessons)}
        />

        <AnimatePresence>
          {notice && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-[13px] leading-relaxed text-amber"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-[13px] leading-relaxed text-coral"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Value and label are separate so a translated label cannot change what
      gets sent upstream. */
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-line bg-ink-900 px-2.5 py-1.5 text-[13px] outline-none transition-colors focus:border-jade-400/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Pulls the first non-Latin or quoted line out of a tutor reply to drill on. */
function firstTargetLine(reply: string) {
  const quoted = reply.match(/["""'']([^""'']{2,80})[""'']/);
  if (quoted) return quoted[1];
  const line = reply
    .split("\n")
    .map((entry) => entry.trim())
    .find((entry) => entry.length > 1 && /[^-]/.test(entry));
  return line?.replace(/^[-*\d.\s]+/, "") ?? "";
}
