import type { Locale } from "@/lib/i18n";

/**
 * The pages built out of curriculum data.
 *
 * The data itself stays in one language on purpose. A rung is called HSK 4
 * everywhere in the world, a drill line is the Mandarin you are meant to say,
 * and translating either would be inventing a second name for something that
 * already has one. What is translated here is the writing around them: the
 * headings, the column labels, and the sentences that say what a number means.
 */

type Catalogue = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  rungs: (count: number, top: string) => string;
  longTailHeading: string;
  longTailBody: string;
};

type Track = {
  back: string;
  start: string;
  stats: {
    rungs: string;
    hours: string;
    words: (authored: number, total: number) => string;
    lines: string;
    noLines: string;
  };
  written: (units: number) => string;
  tutorLed: string;
  target: string;
  linesWritten: (lines: number) => string;
  noLinesYet: string;
  openModule: string;
  openTutor: string;
  notFound: string;
  meta: (language: string, topCode: string) => string;
};

type Modules = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  mandarinHeading: string;
  mandarinBlurb: string;
  englishHeading: string;
  englishBlurb: string;
  units: string;
  words: string;
  questions: string;
};

type ModuleDetail = {
  back: string;
  drill: string;
  hours: string;
  words: string;
  units: string;
  exit: string;
  grammar: string;
  vocabulary: string;
  drills: string;
  feeds: string;
  practice: string;
  tutor: string;
  tutorNote: string;
  notFound: string;
  syllabusNote: string;
};

export const CATALOGUE: Record<Locale, Catalogue> = {
  en: {
    metaTitle: "Catalogue",
    metaDescription:
      "Twelve fully mapped tracks with exam-board syllabi, plus open tutoring in more than two hundred further languages.",
    pill: "Catalogue",
    heading: "Twelve mapped ladders, and open tutoring in everything else",
    lead: "A mapped track carries the published syllabus for its exam board: word counts, study hours, and the specific things you should be able to do at each rung. Languages outside that set still work. The tutor grades them; they simply have no certification ladder attached yet.",
    rungs: (count, top) => `${count} rungs · ${top} at the top`,
    longTailHeading: "Also taught, without a certification ladder",
    longTailBody:
      "Open the tutor, type any of these, and it will hold a graded conversation. Mapped syllabi arrive for the most requested ones first.",
  },
  id: {
    metaTitle: "Katalog",
    metaDescription:
      "Dua belas jalur yang sudah dipetakan lengkap dengan silabus lembaga ujiannya, ditambah tutor terbuka untuk lebih dari dua ratus bahasa lain.",
    pill: "Katalog",
    heading: "Dua belas jenjang terpetakan, dan tutor terbuka untuk selebihnya",
    lead: "Jalur yang terpetakan membawa silabus resmi dari lembaga ujiannya: jumlah kata, jam belajar, dan hal hal tertentu yang harus bisa Anda lakukan di tiap jenjang. Bahasa di luar itu tetap bisa dipakai. Tutor tetap menilainya; hanya saja belum ada jenjang sertifikasi yang menempel padanya.",
    rungs: (count, top) => `${count} jenjang · ${top} di puncaknya`,
    longTailHeading: "Juga diajarkan, tanpa jenjang sertifikasi",
    longTailBody:
      "Buka tutornya, ketik salah satu dari ini, dan tutor akan mengajak Anda bercakap cakap dengan penilaian. Silabus terpetakan akan menyusul, dimulai dari yang paling banyak diminta.",
  },
};

export const TRACK: Record<Locale, Track> = {
  en: {
    back: "Catalogue",
    start: "Start this track",
    stats: {
      rungs: "rungs on the ladder",
      hours: "hours the exam boards assume, not hours supplied here",
      words: (authored, total) =>
        `words the top rung demands · ${authored} of ${total} rungs have written units here`,
      lines: "authored drill lines on this track; the rest is tutor-led",
      noLines: "authored drill lines: this whole track is tutor-led",
    },
    written: (units) => `${units} written units`,
    tutorLed: "Tutor-led",
    target: "Target for this rung",
    linesWritten: (lines) => `${lines} drill lines written`,
    noLinesYet: "No written lines yet",
    openModule: "Open module →",
    openTutor: "Open tutor →",
    notFound: "Track not found",
    meta: (language, topCode) =>
      `Every rung of the ${language} ladder, from first sounds through ${topCode}, graded by speech.`,
  },
  id: {
    back: "Katalog",
    start: "Mulai jalur ini",
    stats: {
      rungs: "jenjang dalam tangga ini",
      hours: "jam yang diasumsikan lembaga ujian, bukan jam yang disediakan di sini",
      words: (authored, total) =>
        `kata yang dituntut jenjang puncak · ${authored} dari ${total} jenjang sudah punya unit tertulis di sini`,
      lines: "baris latihan yang ditulis di jalur ini; sisanya dipandu tutor",
      noLines: "baris latihan tertulis: seluruh jalur ini dipandu tutor",
    },
    written: (units) => `${units} unit tertulis`,
    tutorLed: "Dipandu tutor",
    target: "Target untuk jenjang ini",
    linesWritten: (lines) => `${lines} baris latihan tertulis`,
    noLinesYet: "Belum ada baris tertulis",
    openModule: "Buka modul →",
    openTutor: "Buka tutor →",
    notFound: "Jalur tidak ditemukan",
    meta: (language, topCode) =>
      `Setiap jenjang tangga ${language}, dari bunyi pertama sampai ${topCode}, dinilai lewat ucapan.`,
  },
};

export const MODULES: Record<Locale, Modules> = {
  en: {
    metaTitle: "Modules",
    metaDescription:
      "Unit-level syllabus for HSK 1 through 6 and the English exam ladder up to TOEIC 900, with drill lines and the exam task each unit feeds.",
    pill: "Modules",
    heading: "The actual work, unit by unit",
    lead: "Each unit names the grammar it turns on, the vocabulary it introduces, drill lines you can record straight into the grader, and the exam task it exists to prepare you for. Mandarin drills carry numbered pinyin, which is what allows tone scoring to be measured from your pitch rather than guessed from a transcript.",
    mandarinHeading: "Mandarin, HSK 1 to 6",
    mandarinBlurb:
      "The complete climb from first tones to the summary-writing task that decides most HSK 6 results.",
    englishHeading: "English, repair work to TOEIC 900",
    englishBlurb:
      "Built for candidates who plateau in the 600s and cannot see why. The last two hundred points come from precision and stamina, not new vocabulary.",
    units: "units",
    words: "words",
    questions: "questions",
  },
  id: {
    metaTitle: "Modul",
    metaDescription:
      "Silabus tingkat unit untuk HSK 1 sampai 6 dan jenjang ujian Inggris sampai TOEIC 900, lengkap dengan baris latihan dan tugas ujian yang disiapkan tiap unit.",
    pill: "Modul",
    heading: "Pekerjaan yang sebenarnya, unit demi unit",
    lead: "Tiap unit menyebutkan tata bahasa yang dibahas, kosakata yang diperkenalkan, baris latihan yang bisa langsung Anda rekam ke penilai, dan tugas ujian yang ingin disiapkannya. Latihan Mandarin membawa pinyin bernomor, dan itulah yang membuat nilai nada bisa diukur dari tinggi rendah suara Anda, bukan ditebak dari teks.",
    mandarinHeading: "Mandarin, HSK 1 sampai 6",
    mandarinBlurb:
      "Pendakian lengkap dari nada pertama sampai tugas menulis ringkasan yang menentukan sebagian besar hasil HSK 6.",
    englishHeading: "Inggris, perbaikan menuju TOEIC 900",
    englishBlurb:
      "Disusun untuk peserta yang mentok di kisaran 600 dan tidak tahu sebabnya. Dua ratus poin terakhir datang dari ketelitian dan daya tahan, bukan dari kosakata baru.",
    units: "unit",
    words: "kata",
    questions: "soal",
  },
};

export const MODULE_DETAIL: Record<Locale, ModuleDetail> = {
  en: {
    back: "Modules",
    drill: "Practise this module",
    hours: "study hours",
    words: "words carried",
    units: "units",
    exit: "You leave this module when you can",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    drills: "Drill lines",
    feeds: "Feeds",
    tutor: "Talk to the tutor instead →",
    tutorNote:
      "That is the other half of the site and it works differently: a conversation with a model, metered, with three free rounds before it asks for a wallet. The practice sets on this page are not metered and no model marks them.",
    practice:
      "Each unit below ends with a set of questions built from its own drill lines: multiple choice both ways round, a gap to fill, the line to reassemble, and lines to say out loud. Answers are marked against the syllabus, not by a model, and every line you answer joins your review deck.",
    notFound: "Module not found",
    syllabusNote: "",
  },
  id: {
    back: "Modul",
    drill: "Latih modul ini",
    hours: "jam belajar",
    words: "kata yang dibawa",
    units: "unit",
    exit: "Anda meninggalkan modul ini ketika sudah bisa",
    grammar: "Tata bahasa",
    vocabulary: "Kosakata",
    drills: "Baris latihan",
    feeds: "Menyiapkan",
    tutor: "Atau bicara dengan tutornya →",
    tutorNote:
      "Itu bagian lain dari situs ini dan cara kerjanya berbeda: percakapan dengan model, dibatasi kuota, dengan tiga putaran gratis sebelum diminta menghubungkan dompet. Set latihan di halaman ini tidak dibatasi kuota dan tidak ada model yang menilainya.",
    practice:
      "Tiap unit di bawah ditutup dengan satu set soal yang disusun dari baris latihannya sendiri: pilihan ganda dua arah, satu bagian yang harus diisi, kalimat yang harus disusun ulang, dan kalimat yang harus diucapkan. Jawabannya dicocokkan dengan silabus, bukan dinilai model, dan setiap kalimat yang Anda jawab masuk ke deck pengulangan Anda.",
    notFound: "Modul tidak ditemukan",
    // Said on the page rather than left for the reader to notice on their own.
    syllabusNote:
      "Isi silabus di bawah ini masih dalam bahasa Inggris. Judul unit, butir tata bahasa dan penjelasan artinya belum diterjemahkan, sementara baris latihannya memang ditulis dalam bahasa yang sedang Anda pelajari dan tidak akan diterjemahkan. Di ruang tutor, penjelasannya sudah mengikuti bahasa Indonesia.",
  },
};
