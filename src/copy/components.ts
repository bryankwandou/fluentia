import type { Locale } from "@/lib/i18n";

/**
 * Words that live inside interactive components rather than on a page.
 *
 * These are the easiest strings in a codebase to leave behind in a translation,
 * because they only appear once something has been clicked and a reviewer
 * skimming pages never sees them. /audit walks addresses, not states, so it
 * cannot catch a miss here either. They are gathered in one file so the gap is
 * at least visible to a person reading it.
 */
export type ToneLabCopy = {
  eyebrow: string;
  heading: string;
  toneWord: string;
  meansWord: string;
  ready: string;
  noVoice: string;
  hints: string[];
  glosses: string[];
};

export const TONE_LAB: Record<Locale, ToneLabCopy> = {
  en: {
    eyebrow: "Tone lab",
    heading: "One syllable, four meanings",
    toneWord: "Tone",
    meansWord: "It means",
    ready: "Tap any character to hear it. The tutor grades your attempt against this same contour.",
    noVoice: "Your browser has no Mandarin voice installed, so playback may stay silent. The contour still draws.",
    hints: [
      "held high and flat",
      "rises like a question",
      "dips, then lifts",
      "falls sharply",
    ],
    glosses: ["mother", "hemp", "horse", "to scold"],
  },
  id: {
    eyebrow: "Ruang nada",
    heading: "Satu suku kata, empat arti",
    toneWord: "Nada",
    meansWord: "Artinya",
    ready: "Ketuk aksaranya untuk mendengarkan. Tutor menilai ucapan Anda terhadap lengkung nada yang sama.",
    noVoice: "Peramban Anda belum punya suara Mandarin, jadi mungkin tidak terdengar apa apa. Lengkung nadanya tetap tergambar.",
    hints: [
      "ditahan tinggi dan datar",
      "naik seperti bertanya",
      "turun dulu, lalu naik",
      "jatuh tajam",
    ],
    glosses: ["ibu", "rami", "kuda", "memarahi"],
  },
};
