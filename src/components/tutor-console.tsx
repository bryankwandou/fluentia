"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ScoreBar, ScoreDial } from "./score-dial";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
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

const LANGUAGES = [...TRACKS.map((track) => track.language), ...LONG_TAIL];
const AGES = ["a 4 year old", "a 9 year old", "a teenager", "an adult"];
const FREE_ROUNDS = 3;

export function TutorConsole() {
  const params = useSearchParams();

  const [language, setLanguage] = useState(params.get("language") ?? "Mandarin Chinese");
  const [level, setLevel] = useState(params.get("level") ?? "HSK 1");
  const [age, setAge] = useState("an adult");

  const [messages, setMessages] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recording, setRecording] = useState(false);
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [transcript, setTranscript] = useState("");
  const [targetLine, setTargetLine] = useState("");

  const [rounds, setRounds] = useState(0);
  const [wallet, setWallet] = useState("");
  const [anchoring, setAnchoring] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

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
        body: JSON.stringify({ track: language, level, age, messages: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The tutor did not reply.");

      setMessages([...next, { role: "assistant", content: data.reply }]);
      const line = firstTargetLine(data.reply);
      if (line) setTargetLine(line);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something broke.");
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

    if (rounds >= FREE_ROUNDS && !wallet) {
      setError(
        `You have used your ${FREE_ROUNDS} free rounds. Paste a devnet wallet address to keep going.`
      );
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
      setError("Microphone access was refused, so nothing could be recorded.");
    }
  }

  async function grade_(blob: Blob, mime: string) {
    if (blob.size < 1200) {
      setError("That clip was too short to score. Hold the button a little longer.");
      return;
    }

    setGrading(true);
    setGrade(null);
    setAnchor(null);

    try {
      const form = new FormData();
      const extension = mime.includes("mp4") ? "m4a" : "webm";
      form.append("audio", new File([blob], `attempt.${extension}`, { type: mime }));
      form.append("track", language);
      form.append("level", level);
      form.append("prompt", targetLine);

      const response = await fetch("/api/speech", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Grading failed.");

      setTranscript(data.transcript ?? "");
      setGrade(data.grade as Grade);
      setRounds((count) => count + 1);
      if (data.grade?.nextPrompt) setTargetLine(data.grade.nextPrompt);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Grading failed.");
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
      if (!response.ok) throw new Error(data.error ?? "The write was rejected.");
      setAnchor({ signature: data.signature, digest: data.digest, explorer: data.explorer });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Devnet write failed.");
    } finally {
      setAnchoring(false);
    }
  }

  const roundsLeft = Math.max(0, FREE_ROUNDS - rounds);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
      {/* ------------------------------------------------ conversation */}
      <div className="card flex min-h-[560px] flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <Select value={language} onChange={setLanguage} options={LANGUAGES} label="Language" />
          <Select value={level} onChange={setLevel} options={levels} label="Level" />
          <Select value={age} onChange={setAge} options={AGES} label="Learner" />
          <span className="ml-auto text-xs text-muted">
            {roundsLeft > 0 ? `${roundsLeft} free rounds left` : "Free rounds used"}
          </span>
        </div>

        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center px-6 text-center">
              <div>
                <p className="text-sm text-muted">
                  Ask for a first line, or say something in {language} and let the
                  examiner take it apart.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {[
                    `Give me my first line in ${language}`,
                    "Place me — ask three questions",
                    "Drill me on tones",
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
            placeholder={`Write in ${language} or in English`}
            className="flex-1 rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-jade-400/50"
          />
          <button
            type="submit"
            disabled={thinking || !draft.trim()}
            className="rounded-xl bg-jade-400 px-4 py-2.5 text-sm font-medium text-ink-950 disabled:opacity-35"
          >
            Send
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------- grading */}
      <div className="space-y-5">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
            Speaking round
          </p>

          {targetLine ? (
            <p className="mt-3 rounded-xl border border-line bg-white/[0.03] p-3 text-[15px] leading-relaxed">
              {targetLine}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Ask the tutor for a line first, or just record yourself speaking
              freely and it will be graded as open practice.
            </p>
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
              ? "Marking your attempt…"
              : recording
                ? "Stop and submit"
                : "Record an attempt"}
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
                  <ScoreBar label="Accuracy" value={grade.accuracy} />
                  <ScoreBar label="Pronunciation" value={grade.pronunciation} />
                  <ScoreBar label="Tone" value={grade.tone} />
                  <ScoreBar label="Fluency" value={grade.fluency} />
                </div>
              </div>

              {transcript && (
                <p className="mt-4 rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-[13px] text-muted">
                  Heard: <span className="text-paper/85">{transcript}</span>
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
                    Next line
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

        {/* ------------------------------------------------ credential */}
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
            Anchor the result
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Scores of 60 and above can be written to Solana devnet under your
            wallet. Only the level, the score and a hash travel on chain.
          </p>

          <input
            value={wallet}
            onChange={(event) => {
              setWallet(event.target.value);
              window.localStorage.setItem("fluentia.wallet", event.target.value);
            }}
            placeholder="Your devnet wallet address"
            spellCheck={false}
            className="mt-3 w-full rounded-xl border border-line bg-white/[0.03] px-3 py-2.5 font-mono text-[12.5px] outline-none transition-colors placeholder:font-sans placeholder:text-muted/60 focus:border-jade-400/50"
          />

          <button
            type="button"
            onClick={mint}
            disabled={!grade || grade.score < 60 || !wallet.trim() || anchoring}
            className="mt-3 w-full rounded-xl border border-jade-400/40 bg-jade-500/12 px-4 py-2.5 text-sm font-medium text-jade-300 transition-colors hover:bg-jade-500/20 disabled:opacity-35"
          >
            {anchoring ? "Writing to devnet…" : "Write credential on chain"}
          </button>

          {anchor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-jade-400/30 bg-jade-500/8 p-3 text-[12.5px]"
            >
              <p className="text-muted">Confirmed on devnet.</p>
              <p className="mt-1.5 break-all font-mono text-jade-300">
                {shortAddress(anchor.signature, 10)}
              </p>
              <a
                href={anchor.explorer}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-jade-300 underline underline-offset-4"
              >
                Open in Solana Explorer
              </a>
            </motion.div>
          )}
        </div>

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
  options: string[];
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
          <option key={option} value={option}>
            {option}
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
    .find((entry) => entry.length > 1 && /[^ -]/.test(entry));
  return line?.replace(/^[-*\d.\s]+/, "") ?? "";
}
