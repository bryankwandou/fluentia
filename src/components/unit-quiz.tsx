"use client";

import { useEffect, useRef, useState } from "react";
import { QUIZ } from "@/copy/quiz";
import { TraceBox } from "@/components/trace-box";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { analyseBlob } from "@/lib/pitch";
import { cardId } from "@/lib/srs";
import { useReviews } from "@/lib/store";
import {
  assemble,
  mark,
  speechLangFor,
  type Exercise,
} from "@/lib/exercises";

const EXPLAIN: Record<Locale, string> = { en: "English", id: "Indonesian" };

type Outcome = { id: string; score: number };

/**
 * The practice panel for one unit.
 *
 * The questions arrive already built, from the server, out of the same
 * syllabus printed above them on the page. Nothing here asks a model what to
 * ask — the only call that leaves the browser is the one that grades a
 * recording, and that call has a fixed line to grade against.
 */
export function UnitQuiz({
  locale = DEFAULT_LOCALE,
  track,
  level,
  exercises,
  /** Wording for the closed state. A module-wide sitting and a single unit's
      set are the same panel, and only the invitation differs. */
  label,
}: {
  locale?: Locale;
  track: string;
  level: string;
  exercises: Exercise[];
  label?: string;
}) {
  const copy = QUIZ[locale];
  const { record } = useReviews();

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [tiles, setTiles] = useState<number[]>([]);
  const [marked, setMarked] = useState<number | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [recording, setRecording] = useState(false);
  const [grading, setGrading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detail, setDetail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const item = exercises[index];
  const finished = index >= exercises.length;
  const voice = speechLangFor(track);

  // A listening question that has to be started by hand is a reading question
  // with an extra click, so the line plays as soon as it comes up.
  useEffect(() => {
    if (!item || item.kind !== "listen") return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(item.spoken);
    utterance.lang = voice;
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [item, voice]);

  function resetQuestion() {
    setPicked(null);
    setTyped("");
    setTiles([]);
    setMarked(null);
    setTranscript("");
    setDetail(null);
    setError(null);
  }

  function restart() {
    setIndex(0);
    setOutcomes([]);
    resetQuestion();
  }

  /**
   * Reading the line aloud. The browser's own synthesiser is used rather than a
   * hosted voice: it costs nothing, works with the network down, and cannot
   * stop working because a key expired. Where a browser has no voice installed
   * for the language it says so instead of reading Chinese in English.
   */
  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError(copy.ttsMissing);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  function commit(score: number) {
    if (!item) return;
    setMarked(score);
    setOutcomes((current) => [...current, { id: item.id, score }]);
    record(cardId(track, item.target), score);
  }

  function checkAnswer() {
    if (!item || marked !== null) return;
    const given =
      item.kind === "build"
        ? assemble(
            tiles.map((position) => item.tokens[position]),
            track
          )
        : item.kind === "blank"
          ? typed
          : (picked ?? "");
    commit(mark(item, given));
  }

  function advance() {
    setIndex((current) => current + 1);
    resetQuestion();
  }

  /* ------------------------------------------------------------- speaking */

  async function toggleRecording() {
    if (recording) {
      recorder.current?.stop();
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
        await gradeSpoken(new Blob(chunks.current, { type: mime }), mime);
      };

      recorder.current = instance;
      instance.start();
      setRecording(true);
    } catch {
      setError(copy.micRefused);
    }
  }

  async function gradeSpoken(blob: Blob, mime: string) {
    if (!item || item.kind !== "speak") return;
    if (blob.size < 1200) {
      setError(copy.tooShort);
      return;
    }

    setGrading(true);
    try {
      const form = new FormData();
      const extension = mime.includes("mp4") ? "m4a" : "webm";
      form.append("audio", new File([blob], `attempt.${extension}`, { type: mime }));
      form.append("track", track);
      form.append("level", level);
      form.append("prompt", item.prompt);
      form.append("expectedPinyin", item.promptRoman);
      form.append("explain", EXPLAIN[locale]);

      // Pitch is measured from the raw samples in the browser, before anything
      // is uploaded, because the transcript the grader sees has thrown it away.
      const pitch = await analyseBlob(blob);
      if (pitch && pitch.contour.length > 0) {
        form.append("contour", pitch.contour.join(","));
        form.append("medianHz", String(pitch.medianHz));
        form.append("voicedRatio", String(pitch.voicedRatio));
        form.append("voicedMs", String(pitch.voicedMs));
      }

      const response = await fetch("/api/speech", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? copy.gradingFailed);

      setTranscript(String(data.transcript ?? ""));
      commit(Number(data.grade?.score ?? 0));
    } catch {
      setError(copy.gradingFailed);
    } finally {
      setGrading(false);
    }
  }

  /* ----------------------------------------------------------- rendering */

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          restart();
          setOpen(true);
        }}
        className="btn btn-primary mt-5 px-4 py-2.5 text-[13px]"
      >
        {label ?? copy.open} · {exercises.length}
      </button>
    );
  }

  const right = outcomes.filter((outcome) => outcome.score >= 70).length;

  return (
    <div className="mt-5 rounded-xl border border-jade-400/25 bg-jade-500/[0.04] p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-jade-300/80">
          {finished
            ? copy.doneHeading
            : copy.counter(index + 1, exercises.length)}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] text-muted hover:text-paper"
        >
          {copy.close}
        </button>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-jade-400 transition-all duration-300"
          style={{
            width: `${Math.round((Math.min(index, exercises.length) / exercises.length) * 100)}%`,
          }}
        />
      </div>

      {finished ? (
        <div className="mt-5">
          <p className="text-lg font-medium">
            {copy.doneScore(right, outcomes.length)}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {copy.doneNote}
          </p>
          <button
            type="button"
            onClick={restart}
            className="btn btn-primary mt-4 px-4 py-2.5 text-[13px]"
          >
            {copy.again}
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-[12.5px] text-muted">
            {item.kind === "speak"
              ? copy.askSpeak
              : item.kind === "listen"
                ? copy.askListen
                : item.kind === "trace"
                  ? copy.askTrace
                  : item.kind === "blank"
                    ? copy.askGap
                    : item.kind === "build"
                      ? copy.askBuild
                      : item.direction === "toGloss"
                        ? copy.askMeaning
                        : item.direction === "toTarget"
                          ? copy.askLine
                          : copy.askRoman}
          </p>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            {/* A listening question withholds the text: showing it would turn
                the question into a reading one. It appears once the answer is
                in, so the learner can see what they were listening to. */}
            <p className="text-[19px] leading-snug">
              {item.kind === "listen"
                ? marked !== null
                  ? item.spoken
                  : "· · ·"
                : item.prompt}
            </p>
            {/* Only target-language text is worth hearing. Reading an English
                gloss aloud in a Chinese voice would teach nothing. */}
            {item.kind === "listen" ? (
              <button
                type="button"
                onClick={() => speak(item.spoken)}
                className="rounded-md border border-line px-2 py-1 text-[12px] text-muted hover:text-paper"
              >
                {copy.playAgain}
              </button>
            ) : item.kind !== "choice" || item.direction !== "toTarget" ? (
              <button
                type="button"
                onClick={() => speak(item.kind === "build" ? item.answer : item.prompt)}
                className="rounded-md border border-line px-2 py-1 text-[12px] text-muted hover:text-paper"
              >
                {copy.listen}
              </button>
            ) : null}
          </div>

          {item.kind !== "build" && item.promptRoman && marked !== null && (
            <p className="mt-1 text-[12.5px] text-jade-300/80">{item.promptRoman}</p>
          )}

          {(item.kind === "choice" || item.kind === "listen") && (
            <div className="mt-4 grid gap-2">
              {item.options.map((option) => {
                const chosen = picked === option;
                const isAnswer = option === item.answer;
                const shown = marked !== null;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={shown}
                    onClick={() => setPicked(option)}
                    className={[
                      "rounded-lg border px-3.5 py-2.5 text-left text-[14px] transition-colors",
                      shown && isAnswer
                        ? "border-jade-400/60 bg-jade-500/15"
                        : shown && chosen
                          ? "border-red-400/50 bg-red-500/10"
                          : chosen
                            ? "border-jade-400/50 bg-white/[0.04]"
                            : "border-line hover:border-jade-400/30",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {item.kind === "blank" && (
            <div className="mt-4">
              <p className="text-[13px] text-muted">{item.gloss}</p>
              <input
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") checkAnswer();
                }}
                disabled={marked !== null}
                placeholder={copy.gapPlaceholder}
                className="mt-2 w-full rounded-lg border border-line bg-white/[0.03] px-3.5 py-2.5 text-[14px] outline-none focus:border-jade-400/50"
              />
            </div>
          )}

          {item.kind === "build" && (
            <div className="mt-4">
              <p className="text-[12.5px] text-muted">{copy.buildHint}</p>
              <div className="mt-2 min-h-[46px] rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-[16px]">
                {assemble(
                  tiles.map((position) => item.tokens[position]),
                  track
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {item.tokens.map((token, position) => (
                  <button
                    key={`${token}-${position}`}
                    type="button"
                    disabled={tiles.includes(position) || marked !== null}
                    onClick={() => setTiles((current) => [...current, position])}
                    className="rounded-md border border-line px-2.5 py-1.5 text-[14px] disabled:opacity-25"
                  >
                    {token}
                  </button>
                ))}
              </div>
              {tiles.length > 0 && marked === null && (
                <button
                  type="button"
                  onClick={() => setTiles((current) => current.slice(0, -1))}
                  className="mt-2 text-[12px] text-muted hover:text-paper"
                >
                  {copy.undo}
                </button>
              )}
            </div>
          )}

          {item.kind === "trace" && (
            <div className="mt-4">
              <p className="text-[13px] text-muted">{item.gloss}</p>
              <TraceBox
                key={item.id}
                character={item.prompt}
                hint={copy.traceHint}
                clearLabel={copy.clear}
                submitLabel={copy.submitTrace}
                emptyLabel={copy.traceEmpty}
                disabled={marked !== null}
                onMark={(result) => {
                  setDetail(
                    copy.traceDetail(
                      Math.round(result.accuracy * 100),
                      Math.round(result.coverage * 100)
                    )
                  );
                  commit(result.score);
                }}
              />
            </div>
          )}

          {item.kind === "speak" && (
            <div className="mt-4">
              <p className="text-[13px] text-muted">{item.gloss}</p>
              {item.promptRoman && (
                <p className="mt-1 text-[12.5px] text-jade-300/80">{item.promptRoman}</p>
              )}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={grading || marked !== null}
                className={[
                  "btn mt-3 px-4 py-2.5 text-[13px]",
                  recording ? "btn-ghost" : "btn-primary",
                ].join(" ")}
              >
                {grading ? copy.marking : recording ? copy.stop : copy.record}
              </button>
              {transcript && (
                <p className="mt-2 text-[12.5px] text-muted">
                  {copy.heard} <span className="text-paper/85">{transcript}</span>
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-3 text-[12.5px] text-red-300/80">{error}</p>}

          {marked !== null && (
            <div className="mt-4 rounded-lg border border-line bg-white/[0.02] px-3.5 py-3">
              <p className="text-[13px]">
                {item.kind === "speak"
                  ? copy.spokenScore(marked)
                  : item.kind === "trace"
                    ? copy.traceScore(marked)
                    : marked >= 70
                      ? copy.correct
                      : copy.wrong}
              </p>
              {detail && <p className="mt-1 text-[12.5px] text-muted">{detail}</p>}
              {marked < 70 && item.kind !== "speak" && item.kind !== "trace" && (
                <p className="mt-1 text-[13px] text-muted">
                  {copy.answerWas}{" "}
                  <span className="text-paper/85">{item.answer}</span>
                </p>
              )}
              <p className="mt-1.5 text-[11.5px] text-muted/70">{copy.saved}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            {marked === null ? (
              <>
                {item.kind !== "speak" && item.kind !== "trace" && (
                  <button
                    type="button"
                    onClick={checkAnswer}
                    disabled={
                      ((item.kind === "choice" || item.kind === "listen") &&
                        !picked) ||
                      (item.kind === "blank" && !typed.trim()) ||
                      (item.kind === "build" && tiles.length === 0)
                    }
                    className="btn btn-primary px-4 py-2.5 text-[13px] disabled:opacity-40"
                  >
                    {copy.check}
                  </button>
                )}
                <button
                  type="button"
                  onClick={advance}
                  className="text-[12.5px] text-muted hover:text-paper"
                >
                  {copy.skip}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={advance}
                className="btn btn-primary px-4 py-2.5 text-[13px]"
              >
                {index + 1 === exercises.length ? copy.finish : copy.next}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
