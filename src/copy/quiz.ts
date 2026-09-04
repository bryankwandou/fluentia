import type { Locale } from "@/lib/i18n";

/**
 * Wording for the practice panel.
 *
 * The questions themselves are not in here. Those come from the syllabus and
 * stay in the language being learned; what this file holds is the instruction
 * around them, which follows whichever language the site is being read in.
 */
type Quiz = {
  open: string;
  close: string;
  counter: (done: number, total: number) => string;
  askMeaning: string;
  askLine: string;
  askRoman: string;
  askGap: string;
  askBuild: string;
  askSpeak: string;
  askListen: string;
  askTrace: string;
  listen: string;
  playAgain: string;
  traceHint: string;
  clear: string;
  submitTrace: string;
  traceScore: (score: number) => string;
  traceDetail: (accuracy: number, coverage: number) => string;
  traceEmpty: string;
  gapPlaceholder: string;
  buildHint: string;
  undo: string;
  check: string;
  next: string;
  skip: string;
  finish: string;
  correct: string;
  wrong: string;
  answerWas: string;
  record: string;
  stop: string;
  marking: string;
  micRefused: string;
  tooShort: string;
  gradingFailed: string;
  spokenScore: (score: number) => string;
  heard: string;
  doneHeading: string;
  doneScore: (right: number, total: number) => string;
  doneNote: string;
  again: string;
  saved: string;
  ttsMissing: string;
};

export const QUIZ: Record<Locale, Quiz> = {
  en: {
    open: "Practise this unit",
    close: "Close practice",
    counter: (done, total) => `Question ${done} of ${total}`,
    askMeaning: "What does this line mean?",
    askLine: "Which line says this?",
    askRoman: "Which romanisation belongs to this line?",
    askGap: "Fill the gap",
    askBuild: "Put the line back together",
    askSpeak: "Say this line out loud",
    askListen: "Listen, then choose what you heard",
    askTrace: "Write this character",
    listen: "Hear it",
    playAgain: "Play again",
    traceHint: "Trace over the grey character. Lift the pen between strokes.",
    clear: "Clear",
    submitTrace: "Mark my writing",
    traceScore: (score) => `Scored ${score} out of 100`,
    traceDetail: (accuracy, coverage) =>
      `${accuracy}% of your strokes landed on the character, and they reached ${coverage}% of it.`,
    traceEmpty: "There is nothing written in the box yet.",
    gapPlaceholder: "Type the missing word",
    buildHint: "Tap the pieces in order.",
    undo: "Undo",
    check: "Check",
    next: "Next",
    skip: "Skip",
    finish: "Finish",
    correct: "Correct",
    wrong: "Not this time",
    answerWas: "The answer was",
    record: "Record",
    stop: "Stop and submit",
    marking: "Marking…",
    micRefused: "The microphone was refused, so this one has to be skipped.",
    tooShort: "That recording was too short to mark.",
    gradingFailed: "The examiner could not be reached for that attempt.",
    spokenScore: (score) => `Scored ${score} out of 100`,
    heard: "Heard:",
    doneHeading: "Unit finished",
    doneScore: (right, total) => `${right} of ${total} answered correctly`,
    doneNote:
      "Every line you answered has been added to the review deck. Lines you got wrong come back tomorrow; the rest wait longer each time you pass them.",
    again: "Run it again",
    saved: "Saved to your review deck",
    ttsMissing: "This browser has no voice for that language.",
  },
  id: {
    open: "Latih unit ini",
    close: "Tutup latihan",
    counter: (done, total) => `Soal ${done} dari ${total}`,
    askMeaning: "Apa arti kalimat ini?",
    askLine: "Kalimat mana yang berarti begini?",
    askRoman: "Romanisasi mana yang cocok untuk kalimat ini?",
    askGap: "Isi bagian yang kosong",
    askBuild: "Susun ulang kalimatnya",
    askSpeak: "Ucapkan kalimat ini",
    askListen: "Dengarkan, lalu pilih yang Anda dengar",
    askTrace: "Tulis karakter ini",
    listen: "Dengarkan",
    playAgain: "Putar lagi",
    traceHint: "Ikuti garis karakter abu-abu. Angkat pena di antara goresan.",
    clear: "Hapus",
    submitTrace: "Nilai tulisan saya",
    traceScore: (score) => `Nilainya ${score} dari 100`,
    traceDetail: (accuracy, coverage) =>
      `${accuracy}% goresan Anda jatuh di atas karakternya, dan mencapai ${coverage}% bagiannya.`,
    traceEmpty: "Belum ada tulisan di kotaknya.",
    gapPlaceholder: "Ketik kata yang hilang",
    buildHint: "Ketuk potongannya sesuai urutan.",
    undo: "Batalkan",
    check: "Periksa",
    next: "Lanjut",
    skip: "Lewati",
    finish: "Selesai",
    correct: "Benar",
    wrong: "Belum tepat",
    answerWas: "Jawabannya",
    record: "Rekam",
    stop: "Berhenti dan kirim",
    marking: "Sedang dinilai…",
    micRefused: "Mikrofonnya ditolak, jadi soal ini harus dilewati.",
    tooShort: "Rekamannya terlalu pendek untuk dinilai.",
    gradingFailed: "Pengujinya tidak bisa dihubungi untuk percobaan itu.",
    spokenScore: (score) => `Nilainya ${score} dari 100`,
    heard: "Terdengar:",
    doneHeading: "Unit selesai",
    doneScore: (right, total) => `${right} dari ${total} soal dijawab benar`,
    doneNote:
      "Setiap kalimat yang Anda jawab masuk ke deck pengulangan. Yang salah kembali besok; sisanya menunggu makin lama setiap kali Anda lulus.",
    again: "Ulangi lagi",
    saved: "Tersimpan di deck pengulangan Anda",
    ttsMissing: "Peramban ini tidak punya suara untuk bahasa tersebut.",
  },
};
