export type Stage = "seedling" | "starter" | "builder" | "operator" | "native";

export type Track = {
  slug: string;
  language: string;
  native: string;
  flagHint: string;
  family: string;
  learners: string;
  frameworks: string[];
  levels: Level[];
  featured?: boolean;
};

export type Level = {
  code: string;
  title: string;
  stage: Stage;
  words: number;
  hours: number;
  can: string;
};

export const STAGE_COPY: Record<Stage, { label: string; note: string }> = {
  seedling: { label: "Ages 3-6", note: "Sound play, no reading required" },
  starter: { label: "Ages 7-12", note: "Story lessons with picture prompts" },
  builder: { label: "Teen & adult", note: "Grammar drilled through conversation" },
  operator: { label: "Working level", note: "Meetings, email, negotiation" },
  native: { label: "Exam grade", note: "Certification-tier reading and writing" },
};

const hskLevels: Level[] = [
  { code: "HSK 1", title: "First hundred characters", stage: "starter", words: 150, hours: 24, can: "Greet people, count, name everyday objects" },
  { code: "HSK 2", title: "Daily routines", stage: "starter", words: 300, hours: 36, can: "Order food, ask directions, describe your day" },
  { code: "HSK 3", title: "Opinions and plans", stage: "builder", words: 600, hours: 60, can: "Handle travel, make plans, explain preferences" },
  { code: "HSK 4", title: "Work and study", stage: "builder", words: 1200, hours: 96, can: "Discuss work, read short articles, argue a point" },
  { code: "HSK 5", title: "Media literacy", stage: "operator", words: 2500, hours: 150, can: "Read newspapers, watch film without subtitles" },
  { code: "HSK 6", title: "Full command", stage: "native", words: 5000, hours: 240, can: "Express nuance fluently in speech and writing" },
];

const cefrLevels = (lang: string): Level[] => [
  { code: "A1", title: "Getting a footing", stage: "starter", words: 500, hours: 60, can: `Introduce yourself and survive a first trip in ${lang}` },
  { code: "A2", title: "Everyday exchanges", stage: "starter", words: 1000, hours: 80, can: "Shop, commute, small talk with neighbours" },
  { code: "B1", title: "Standing your ground", stage: "builder", words: 2000, hours: 140, can: "Handle most travel situations and explain opinions" },
  { code: "B2", title: "Working comfortably", stage: "operator", words: 4000, hours: 200, can: "Hold technical conversations without straining" },
  { code: "C1", title: "Fluent and flexible", stage: "operator", words: 8000, hours: 300, can: "Use the language socially, academically, professionally" },
  { code: "C2", title: "Mastery", stage: "native", words: 16000, hours: 420, can: "Read anything, argue anything, write publishable prose" },
];

const kidsLevels: Level[] = [
  { code: "K0", title: "Ears first", stage: "seedling", words: 40, hours: 10, can: "Copy sounds and rhythms through song" },
  { code: "K1", title: "Naming the world", stage: "seedling", words: 120, hours: 18, can: "Point and name family, food, animals, colours" },
  { code: "K2", title: "Short sentences", stage: "starter", words: 300, hours: 30, can: "Ask for things and answer simple questions" },
];

/**
 * English does not run on CEFR here. The four rungs below are the four written
 * modules that already exist for it, and the ladder is named after the exams
 * learners are actually sitting rather than after a framework we would only be
 * approximating. Without this track those modules were reachable at their own
 * URL and from nowhere else — built, paid for in effort, and invisible.
 */
const englishLevels: Level[] = [
  { code: "Foundation", title: "Repair work", stage: "builder", words: 2000, hours: 80, can: "Speak for two minutes and self-correct without being prompted" },
  { code: "TOEIC 700", title: "Working proficiency", stage: "operator", words: 4000, hours: 140, can: "Handle meetings, email and negotiation at office pace" },
  { code: "TOEIC 900", title: "Ceiling band", stage: "operator", words: 8000, hours: 220, can: "Hold the 900 band across timed papers with no weak section" },
  { code: "TOEFL 100", title: "Academic ceiling", stage: "native", words: 12000, hours: 300, can: "Sit TOEFL at 100+ including integrated writing and speaking" },
];

export const TRACKS: Track[] = [
  {
    slug: "mandarin",
    language: "Mandarin Chinese",
    native: "普通话",
    flagHint: "CN",
    family: "Sino-Tibetan",
    learners: "1.1B speakers",
    frameworks: ["HSK 1-6", "HSKK Speaking", "YCT Kids"],
    levels: [...kidsLevels, ...hskLevels],
    featured: true,
  },
  {
    slug: "english",
    language: "English",
    native: "English",
    flagHint: "GB",
    family: "Indo-European",
    learners: "1.5B speakers",
    frameworks: ["TOEFL iBT", "TOEIC", "IELTS"],
    levels: [...kidsLevels, ...englishLevels],
    featured: true,
  },
  {
    slug: "japanese",
    language: "Japanese",
    native: "日本語",
    flagHint: "JP",
    family: "Japonic",
    learners: "125M speakers",
    frameworks: ["JLPT N5-N1", "Kanji Kentei"],
    levels: [...kidsLevels, ...cefrLevels("Japanese")],
    featured: true,
  },
  {
    slug: "spanish",
    language: "Spanish",
    native: "Español",
    flagHint: "ES",
    family: "Romance",
    learners: "560M speakers",
    frameworks: ["CEFR A1-C2", "DELE"],
    levels: [...kidsLevels, ...cefrLevels("Spanish")],
    featured: true,
  },
  {
    slug: "arabic",
    language: "Modern Standard Arabic",
    native: "العربية",
    flagHint: "SA",
    family: "Semitic",
    learners: "420M speakers",
    frameworks: ["CEFR A1-C2", "ALPT"],
    levels: [...kidsLevels, ...cefrLevels("Arabic")],
    featured: true,
  },
  {
    slug: "korean",
    language: "Korean",
    native: "한국어",
    flagHint: "KR",
    family: "Koreanic",
    learners: "82M speakers",
    frameworks: ["TOPIK I-II", "CEFR"],
    levels: [...kidsLevels, ...cefrLevels("Korean")],
  },
  {
    slug: "french",
    language: "French",
    native: "Français",
    flagHint: "FR",
    family: "Romance",
    learners: "310M speakers",
    frameworks: ["CEFR A1-C2", "DELF/DALF"],
    levels: [...kidsLevels, ...cefrLevels("French")],
  },
  {
    slug: "german",
    language: "German",
    native: "Deutsch",
    flagHint: "DE",
    family: "Germanic",
    learners: "135M speakers",
    frameworks: ["CEFR A1-C2", "Goethe"],
    levels: [...kidsLevels, ...cefrLevels("German")],
  },
  {
    slug: "indonesian",
    language: "Indonesian",
    native: "Bahasa Indonesia",
    flagHint: "ID",
    family: "Austronesian",
    learners: "200M speakers",
    frameworks: ["CEFR A1-C2", "UKBI"],
    levels: [...kidsLevels, ...cefrLevels("Indonesian")],
  },
  {
    slug: "portuguese",
    language: "Portuguese",
    native: "Português",
    flagHint: "BR",
    family: "Romance",
    learners: "265M speakers",
    frameworks: ["CEFR A1-C2", "CELPE-Bras"],
    levels: [...kidsLevels, ...cefrLevels("Portuguese")],
  },
  {
    slug: "hindi",
    language: "Hindi",
    native: "हिन्दी",
    flagHint: "IN",
    family: "Indo-Aryan",
    learners: "610M speakers",
    frameworks: ["CEFR A1-C2"],
    levels: [...kidsLevels, ...cefrLevels("Hindi")],
  },
  {
    slug: "russian",
    language: "Russian",
    native: "Русский",
    flagHint: "RU",
    family: "Slavic",
    learners: "255M speakers",
    frameworks: ["TORFL", "CEFR"],
    levels: [...kidsLevels, ...cefrLevels("Russian")],
  },
  {
    slug: "vietnamese",
    language: "Vietnamese",
    native: "Tiếng Việt",
    flagHint: "VN",
    family: "Austroasiatic",
    learners: "86M speakers",
    frameworks: ["CEFR A1-C2"],
    levels: [...kidsLevels, ...cefrLevels("Vietnamese")],
  },
];

export function getTrack(slug: string) {
  return TRACKS.find((track) => track.slug === slug);
}

/** Long tail rendered in the catalogue marquee; the tutor accepts any of them. */
export const LONG_TAIL = [
  "Italian", "Dutch", "Turkish", "Thai", "Polish", "Swedish", "Greek", "Hebrew",
  "Ukrainian", "Czech", "Romanian", "Hungarian", "Finnish", "Danish", "Norwegian",
  "Tagalog", "Malay", "Bengali", "Tamil", "Urdu", "Persian", "Swahili", "Yoruba",
  "Hausa", "Amharic", "Zulu", "Javanese", "Sundanese", "Burmese", "Khmer", "Lao",
  "Nepali", "Sinhala", "Punjabi", "Marathi", "Telugu", "Kannada", "Malayalam",
  "Gujarati", "Mongolian", "Kazakh", "Uzbek", "Georgian", "Armenian", "Serbian",
  "Croatian", "Bulgarian", "Slovak", "Slovenian", "Lithuanian", "Latvian",
  "Estonian", "Icelandic", "Irish", "Welsh", "Basque", "Catalan", "Galician",
  "Afrikaans", "Quechua", "Nahuatl", "Maori", "Hawaiian", "Cantonese", "Hokkien",
];

export const PRICING = [
  {
    name: "Trial",
    price: 0,
    unit: "",
    tagline: "Enough to know whether the tutor listens properly.",
    features: [
      "Three graded speaking rounds",
      "One placement diagnostic",
      "Full catalogue browsing",
      "Devnet wallet connect",
    ],
    cta: "Start without paying",
    highlight: false,
  },
  {
    name: "Per lesson",
    price: 0.25,
    unit: "USDC / lesson",
    tagline: "You fund a balance and each finished lesson draws from it.",
    features: [
      "Charged only when a lesson is completed",
      "Unspent balance withdraws any time",
      "Every score anchored on Solana",
      "Speech grading with tone breakdown",
      "Works across all 200+ tracks",
    ],
    cta: "Fund a balance",
    highlight: true,
  },
  {
    name: "Cohort",
    price: 12,
    unit: "USDC / month",
    tagline: "For schools and teams that need seats and a roster view.",
    features: [
      "Unlimited lessons per seat",
      "Class roster with progress export",
      "Shared credential registry",
      "Curriculum aligned to HSK, JLPT, CEFR",
      "Invoice settlement in USDC",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];
