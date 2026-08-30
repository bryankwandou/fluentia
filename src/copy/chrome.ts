import type { Locale } from "@/lib/i18n";

/**
 * The navigation, the footer and the language control.
 *
 * Kept apart from the page dictionaries because these strings appear on every
 * screen, so a gap here is visible everywhere at once rather than on one page
 * somebody may not open.
 */
type Chrome = {
  nav: { to: string; label: string }[];
  cta: string;
  menu: { open: string; close: string; label: string };
  language: string;
  blurb: string;
  devnet: string;
  built: string;
  columns: { title: string; links: { to: string; label: string; external?: boolean }[] }[];
};

/**
 * The unit-level syllabus sat at /modules for weeks with nothing linking to it.
 * It was reachable from a track page, two clicks in, and from nowhere else — so
 * a first-time reader saw the tutor, decided the site was a chat window, and
 * left before finding the written course. It goes in the top bar for that
 * reason: the coursework is the product, and it has to be one click from every
 * page.
 */
const NAV_PATHS = ["/catalogue", "/modules", "/tutor", "/credentials", "/pricing", "/audit"];

const EN_LABELS = ["Catalogue", "Modules", "Tutor", "Credentials", "Pricing", "Audit"];
const ID_LABELS = ["Katalog", "Modul", "Tutor", "Sertifikat", "Harga", "Audit"];

const SOURCE = "https://github.com/bryankwandou/fluentia";

export const CHROME: Record<Locale, Chrome> = {
  en: {
    nav: NAV_PATHS.map((to, index) => ({ to, label: EN_LABELS[index] })),
    cta: "Open the tutor",
    menu: { open: "Menu", close: "Close", label: "Toggle navigation" },
    language: "Language",
    blurb:
      "Study any of 200+ languages against a real examiner, then keep a record of the result that outlives the app it came from.",
    devnet: "Running on Solana devnet. Balances are test funds, not money.",
    built: "Built for the Solana hackathon. Devnet only.",
    columns: [
      {
        title: "Study",
        links: [
          { to: "/catalogue", label: "Language catalogue" },
          { to: "/modules", label: "Syllabus, unit by unit" },
          { to: "/modules/hsk-1", label: "HSK 1, first units" },
          { to: "/catalogue/mandarin", label: "Mandarin, HSK 1-6" },
          { to: "/tutor", label: "Live speaking tutor" },
          { to: "/kids", label: "Kids and early years" },
        ],
      },
      {
        title: "Proof",
        links: [
          { to: "/audit", label: "Audit this site" },
          { to: "/credentials", label: "Credential registry" },
          { to: "/credentials#verify", label: "Verify a signature" },
          { to: "/pricing", label: "What a lesson costs" },
        ],
      },
      {
        title: "Company",
        links: [
          { to: "/manifesto", label: "Why we built this" },
          { to: "/coverage", label: "What is actually built" },
          { to: SOURCE, label: "Source on GitHub", external: true },
        ],
      },
    ],
  },

  id: {
    nav: NAV_PATHS.map((to, index) => ({ to, label: ID_LABELS[index] })),
    cta: "Buka tutornya",
    menu: { open: "Menu", close: "Tutup", label: "Buka tutup navigasi" },
    language: "Bahasa",
    blurb:
      "Belajar salah satu dari 200+ bahasa dengan penguji sungguhan, lalu simpan hasilnya dalam catatan yang tetap ada setelah aplikasinya tidak ada.",
    devnet: "Berjalan di Solana devnet. Saldonya dana uji, bukan uang.",
    built: "Dibuat untuk hackathon Solana. Hanya devnet.",
    columns: [
      {
        title: "Belajar",
        links: [
          { to: "/catalogue", label: "Katalog bahasa" },
          { to: "/modules", label: "Silabus, unit demi unit" },
          { to: "/modules/hsk-1", label: "HSK 1, unit pertama" },
          { to: "/catalogue/mandarin", label: "Mandarin, HSK 1-6" },
          { to: "/tutor", label: "Tutor bicara langsung" },
          { to: "/kids", label: "Anak dan usia dini" },
        ],
      },
      {
        title: "Bukti",
        links: [
          { to: "/audit", label: "Periksa situs ini" },
          { to: "/credentials", label: "Daftar sertifikat" },
          { to: "/credentials#verify", label: "Verifikasi tanda tangan" },
          { to: "/pricing", label: "Biaya satu pelajaran" },
        ],
      },
      {
        title: "Tentang",
        links: [
          { to: "/manifesto", label: "Alasan kami membangunnya" },
          { to: "/coverage", label: "Apa yang sudah jadi" },
          { to: SOURCE, label: "Kode sumber di GitHub", external: true },
        ],
      },
    ],
  },
};
