"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TONE_LAB } from "@/copy/components";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The one syllable every Mandarin beginner gets humbled by. Same letters, four
 * pitch shapes, four unrelated meanings. Clicking a tone draws its contour and
 * speaks it through the browser's own voice engine, so the point lands in two
 * seconds without an account or a download.
 */
const TONES = [
  { mark: "mā", tone: 1, hanzi: "妈", path: "M4,20 L96,20" },
  { mark: "má", tone: 2, hanzi: "麻", path: "M4,34 L96,8" },
  { mark: "mǎ", tone: 3, hanzi: "马", path: "M4,18 Q30,40 50,36 Q76,32 96,6" },
  { mark: "mà", tone: 4, hanzi: "骂", path: "M4,6 L96,36" },
];

export function ToneLab({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = TONE_LAB[locale];
  const [active, setActive] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const check = () => setVoiceReady(window.speechSynthesis.getVoices().length > 0);
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
  }, []);

  const current = TONES[active];

  function say(index: number) {
    setActive(index);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(TONES[index].hanzi);
    utterance.lang = "zh-CN";
    utterance.rate = 0.75;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
            {copy.eyebrow}
          </p>
          <h3 className="mt-1.5 text-lg font-medium">{copy.heading}</h3>
        </div>
        <span
          className={cn(
            "relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
            speaking ? "bg-jade-400 pulse-ring" : "bg-ink-700"
          )}
        />
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {TONES.map((tone, index) => (
          <button
            key={tone.mark}
            type="button"
            onClick={() => say(index)}
            className={cn(
              "group rounded-xl border px-2 py-3 text-center transition-all duration-200",
              index === active
                ? "border-jade-400/60 bg-jade-500/12"
                : "border-line bg-white/[0.02] hover:border-white/20"
            )}
          >
            <span className="block text-xl leading-none">{tone.hanzi}</span>
            <span
              className={cn(
                "mt-1.5 block text-sm",
                index === active ? "text-jade-300" : "text-muted"
              )}
            >
              {tone.mark}
            </span>
          </button>
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-xl border border-line bg-ink-950/60 p-4">
        <svg viewBox="0 0 100 44" className="h-24 w-full" preserveAspectRatio="none">
          <line x1="0" y1="22" x2="100" y2="22" stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" />
          <motion.path
            key={current.mark}
            d={current.path}
            fill="none"
            stroke="url(#tone-stroke)"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="tone-stroke" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#7de6bd" />
            </linearGradient>
          </defs>
        </svg>

        <AnimatePresence mode="wait">
          <motion.p
            key={current.mark}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-sm text-muted"
          >
            <span className="text-paper">
              {copy.toneWord} {current.tone}
            </span>
            , {copy.hints[active]}. {copy.meansWord}{" "}
            <span className="text-paper">{copy.glosses[active]}</span>.
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted/70">
        {voiceReady ? copy.ready : copy.noVoice}
      </p>
    </div>
  );
}
