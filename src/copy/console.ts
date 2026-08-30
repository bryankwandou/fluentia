import type { Locale } from "@/lib/i18n";

/**
 * Every word the tutor console says for itself.
 *
 * The console is the one screen a learner sits inside for a whole session, so
 * leaving it in English while the rest of the site had switched was the most
 * visible half-finished thing here. What it cannot restate is the material:
 * the target line stays in the language being learned, and the model's own
 * explanations follow the language asked for in the prompt rather than being
 * listed here.
 */
type Console = {
  languageLabel: string;
  levelLabel: string;
  learnerLabel: string;
  /** The value goes to the model as written; only the label is translated. */
  ages: { value: string; label: string }[];
  freeLeft: (rounds: number) => string;
  paidLeft: (lessons: number) => string;
  roundsSpent: string;
  openingPrompt: (language: string) => string;
  seedFirstLine: (language: string) => string;
  seedPlaceMe: string;
  seedTones: string;
  inputPlaceholder: (language: string) => string;
  send: string;
  speakingRound: string;
  cardNew: string;
  cardRelearn: string;
  measuredNotGuessed: string;
  noTargetYet: string;
  marking: string;
  stopAndSubmit: string;
  recordAttempt: string;
  accuracy: string;
  pronunciation: string;
  tone: string;
  fluency: string;
  pitchHeading: string;
  sharedTitle: (names: string) => string;
  sharedNote: string;
  heard: string;
  nextLine: string;
  deckHeading: string;
  clear: string;
  learning: string;
  retained: string;
  dueNow: string;
  averaging: (mean: number, total: number) => string;
  schedule: (passMark: number) => string;
  anchorHeading: string;
  anchorBlurb: string;
  connectWallet: string;
  writing: string;
  writeCredential: string;
  confirmed: string;
  openExplorer: string;
  errTutorSilent: string;
  errGeneric: string;
  errMicRefused: string;
  errTooShort: string;
  errGrading: string;
  errWriteRejected: string;
  errDevnet: string;
  errRoundsSpent: (rounds: number) => string;
};

export const CONSOLE: Record<Locale, Console> = {
  en: {
    languageLabel: "Language",
    levelLabel: "Level",
    learnerLabel: "Learner",
    ages: [
      { value: "a 4 year old", label: "a 4 year old" },
      { value: "a 9 year old", label: "a 9 year old" },
      { value: "a teenager", label: "a teenager" },
      { value: "an adult", label: "an adult" },
    ],
    freeLeft: (rounds) => `${rounds} free rounds left`,
    paidLeft: (lessons) => `${lessons} paid lessons left`,
    roundsSpent: "Free rounds used",
    openingPrompt: (language) =>
      `Ask for a first line, or say something in ${language} and let the examiner take it apart.`,
    seedFirstLine: (language) => `Give me my first line in ${language}`,
    seedPlaceMe: "Place me, ask three questions",
    seedTones: "Drill me on tones",
    inputPlaceholder: (language) => `Write in ${language} or in English`,
    send: "Send",
    speakingRound: "Speaking round",
    cardNew: "new",
    cardRelearn: "relearn",
    measuredNotGuessed: "tones will be measured, not guessed",
    noTargetYet:
      "Ask the tutor for a line first, or just record yourself speaking freely and it will be graded as open practice.",
    marking: "Marking your attempt...",
    stopAndSubmit: "Stop and submit",
    recordAttempt: "Record an attempt",
    accuracy: "Accuracy",
    pronunciation: "Pronunciation",
    tone: "Tone",
    fluency: "Fluency",
    pitchHeading: "Pitch measured from the recording",
    sharedTitle: (names) =>
      `Scored the same as ${names}. The difference between them is a glottal one, and pitch cannot show it.`,
    sharedNote:
      "Rows marked ~ share a score with a neighbouring tone. What separates those is a catch in the throat rather than a change in pitch, and pitch is all this reads, so the mark covers the melody and stops there.",
    heard: "Heard:",
    nextLine: "Next line",
    deckHeading: "Review deck",
    clear: "Clear",
    learning: "Learning",
    retained: "Retained",
    dueNow: "Due now",
    averaging: (mean, total) => `Averaging ${mean} across ${total} lines. `,
    schedule: (passMark) =>
      `A line returns the day after it is passed, then after six days, and from there the gap widens with every clean attempt. Anything scored under ${passMark} comes straight back.`,
    anchorHeading: "Anchor the result",
    anchorBlurb:
      "Scores of 60 and above can be written to Solana devnet under your wallet. Only the level, the score and a hash travel on chain.",
    connectWallet: "Connect a wallet below to receive it.",
    writing: "Writing to devnet...",
    writeCredential: "Write credential on chain",
    confirmed: "Confirmed on devnet.",
    openExplorer: "Open in Solana Explorer",
    errTutorSilent: "The tutor did not reply.",
    errGeneric: "Something broke.",
    errMicRefused: "Microphone access was refused, so nothing could be recorded.",
    errTooShort: "That clip was too short to score. Hold the button a little longer.",
    errGrading: "Grading failed.",
    errWriteRejected: "The write was rejected.",
    errDevnet: "Devnet write failed.",
    errRoundsSpent: (rounds) =>
      `Your ${rounds} free rounds are spent. Fund a USDC balance below to carry on.`,
  },
  id: {
    languageLabel: "Bahasa",
    levelLabel: "Jenjang",
    learnerLabel: "Pelajar",
    ages: [
      { value: "a 4 year old", label: "anak 4 tahun" },
      { value: "a 9 year old", label: "anak 9 tahun" },
      { value: "a teenager", label: "remaja" },
      { value: "an adult", label: "dewasa" },
    ],
    freeLeft: (rounds) => `sisa ${rounds} ronde gratis`,
    paidLeft: (lessons) => `sisa ${lessons} sesi berbayar`,
    roundsSpent: "Ronde gratis habis",
    openingPrompt: (language) =>
      `Minta kalimat pertama, atau ucapkan sesuatu dalam ${language} dan biarkan penguji membedahnya.`,
    seedFirstLine: (language) => `Beri saya kalimat pertama dalam ${language}`,
    seedPlaceMe: "Tempatkan saya, ajukan tiga pertanyaan",
    seedTones: "Latih saya soal nada",
    inputPlaceholder: (language) => `Tulis dalam ${language} atau bahasa Inggris`,
    send: "Kirim",
    speakingRound: "Ronde bicara",
    cardNew: "baru",
    cardRelearn: "ulang",
    measuredNotGuessed: "nada diukur, bukan ditebak",
    noTargetYet:
      "Mintalah satu kalimat dulu ke tutor, atau rekam saja diri Anda berbicara bebas dan itu akan dinilai sebagai latihan terbuka.",
    marking: "Menilai rekaman Anda...",
    stopAndSubmit: "Hentikan dan kirim",
    recordAttempt: "Rekam percobaan",
    accuracy: "Ketepatan",
    pronunciation: "Pelafalan",
    tone: "Nada",
    fluency: "Kelancaran",
    pitchHeading: "Tinggi nada yang diukur dari rekaman",
    sharedTitle: (names) =>
      `Dinilai sama dengan ${names}. Yang membedakan keduanya adalah hentakan di tenggorokan, dan tinggi nada tidak bisa menunjukkannya.`,
    sharedNote:
      "Baris bertanda ~ berbagi nilai dengan nada tetangganya. Yang memisahkan keduanya adalah hentakan di tenggorokan, bukan perubahan tinggi nada, sedangkan tinggi nada itulah satu satunya yang dibaca di sini, jadi penilaian ini mencakup lagunya lalu berhenti di situ.",
    heard: "Terdengar:",
    nextLine: "Kalimat berikutnya",
    deckHeading: "Tumpukan ulangan",
    clear: "Kosongkan",
    learning: "Sedang dipelajari",
    retained: "Sudah melekat",
    dueNow: "Jatuh tempo",
    averaging: (mean, total) => `Rata rata ${mean} dari ${total} kalimat. `,
    schedule: (passMark) =>
      `Sebuah kalimat kembali sehari setelah lulus, lalu enam hari kemudian, dan sesudah itu jaraknya melebar tiap kali percobaan bersih. Apa pun yang bernilai di bawah ${passMark} langsung kembali.`,
    anchorHeading: "Catatkan hasilnya",
    anchorBlurb:
      "Nilai 60 ke atas bisa ditulis ke Solana devnet atas nama dompet Anda. Hanya jenjang, nilai, dan sebuah hash yang masuk ke rantai.",
    connectWallet: "Hubungkan dompet di bawah untuk menerimanya.",
    writing: "Menulis ke devnet...",
    writeCredential: "Tulis sertifikat ke rantai",
    confirmed: "Terkonfirmasi di devnet.",
    openExplorer: "Buka di Solana Explorer",
    errTutorSilent: "Tutor tidak menjawab.",
    errGeneric: "Ada yang gagal.",
    errMicRefused: "Akses mikrofon ditolak, jadi tidak ada yang terekam.",
    errTooShort:
      "Rekaman itu terlalu pendek untuk dinilai. Tahan tombolnya sedikit lebih lama.",
    errGrading: "Penilaian gagal.",
    errWriteRejected: "Penulisan ditolak.",
    errDevnet: "Penulisan ke devnet gagal.",
    errRoundsSpent: (rounds) =>
      `${rounds} ronde gratis Anda sudah terpakai. Isi saldo USDC di bawah untuk melanjutkan.`,
  },
};
