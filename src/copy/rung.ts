import type { Locale } from "@/lib/i18n";

type Rung = {
  back: string;
  unwritten: string;
  can: string;
  target: string;
  words: string;
  hours: string;
  nothingYet: string;
  nearest: string;
  openModule: (code: string) => string;
  noneOnTrack: string;
  tutorHeading: string;
  tutorBody: string;
  tutorLink: string;
  notFound: string;
};

export const RUNG: Record<Locale, Rung> = {
  en: {
    back: "Back to the ladder",
    unwritten: "Not written yet",
    can: "What this rung asks of you",
    target: "Exam board target",
    words: "words",
    hours: "study hours",
    nothingYet:
      "Nobody has written the lessons for this rung yet. We would rather show you an empty shelf than fill it with text a model made up on the spot.",
    nearest: "Written material on this track you can use today",
    openModule: (code) => `Open ${code}, free →`,
    noneOnTrack:
      "This track has no written modules yet. Mandarin, English, Japanese and Korean do.",
    tutorHeading: "The AI tutor is separate",
    tutorBody:
      "It needs a Pro account. It holds a spoken conversation at this level and grades what you say, but it is not a lesson plan, and it is not what this page is.",
    tutorLink: "Open the AI tutor (Pro)",
    notFound: "Rung not found",
  },
  id: {
    back: "Kembali ke jenjang",
    unwritten: "Belum ditulis",
    can: "Yang dituntut jenjang ini",
    target: "Target lembaga ujian",
    words: "kata",
    hours: "jam belajar",
    nothingYet:
      "Materi untuk jenjang ini belum ditulis. Kami lebih memilih menunjukkan rak kosong daripada mengisinya dengan teks buatan model.",
    nearest: "Materi tertulis di jalur ini yang bisa dipakai sekarang",
    openModule: (code) => `Buka ${code}, gratis →`,
    noneOnTrack:
      "Jalur ini belum punya modul tertulis. Mandarin, Inggris, Jepang dan Korea sudah.",
    tutorHeading: "Tutor AI terpisah",
    tutorBody:
      "Tutor butuh akun Pro. Tutor mengajak bercakap di jenjang ini dan menilai ucapan Anda, tapi itu bukan rencana pelajaran, dan bukan isi halaman ini.",
    tutorLink: "Buka tutor AI (Pro)",
    notFound: "Jenjang tidak ditemukan",
  },
};
