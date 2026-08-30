import type { Locale } from "@/lib/i18n";

/**
 * Prose pages, the ones whose whole content is argument rather than data.
 *
 * Held together in one file so a reviewer can read both languages of a page
 * side by side. Splitting them per page hid, in an earlier draft, that one
 * paragraph had been softened in translation and no longer said the same thing.
 */

type Manifesto = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  paragraphs: string[][];
  ctaPrimary: string;
  ctaSecondary: string;
};

type Kids = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  principles: { title: string; body: string }[];
  routeHeading: string;
  route: { code: string; title: string; body: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
};

type Tutor = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  loading: string;
  /**
   * Said on the console itself. A reader who opens this page first sees a chat
   * box and reasonably concludes that is the whole product, so the page has to
   * name where the lines come from and link to it.
   */
  sourceNote: string;
  sourceLink: string;
};

export const MANIFESTO: Record<Locale, Manifesto> = {
  en: {
    metaTitle: "Why we built this",
    metaDescription:
      "The argument behind Fluentia: soft grading wastes years, and a certificate nobody can check is worth very little.",
    pill: "Position",
    heading: "Two habits that keep learners stuck",
    paragraphs: [
      [
        "The first is soft grading. An app that congratulates a mangled sentence is pleasant to use and expensive to trust. Learners spend months collecting green marks and then freeze the first time a native speaker answers at normal speed. The feedback was never honest enough to be useful.",
        "We took the other route. Every recording is scored on four separate axes, and a poor attempt is told it was poor, along with the one correction most worth making. It is less comfortable. It is also the only version that shortens the road.",
      ],
      [
        "The second habit is the disposable certificate. Course platforms hand out a PDF whose only guarantee is that the company issuing it still exists. Schools fold, apps shut down, and years of study become a claim on a résumé that nobody can confirm.",
        "So we publish the result instead of storing it. When you clear a level, the language, the rung, the score and a hash of the graded attempt are written to Solana under your wallet. Reading it back takes a signature and a public endpoint. It works whether or not we are still here, which is the entire point.",
      ],
      [
        "Everything else follows from those two decisions. Pricing runs per finished lesson because we would rather be paid for work done than for a forgotten renewal. The children's track drops streaks and leaderboards because we are not willing to sell attention capture to parents as education. The catalogue climbs to HSK 6 and CEFR C2 because stopping at holiday phrases is where the market already is, and it is not where people actually need help.",
      ],
    ],
    ctaPrimary: "Test the grading yourself",
    ctaSecondary: "Read the source",
  },
  id: {
    metaTitle: "Alasan kami membangunnya",
    metaDescription:
      "Alasan di balik Fluentia: penilaian yang terlalu lunak membuang waktu bertahun tahun, dan sertifikat yang tidak bisa diperiksa siapa pun nilainya kecil.",
    pill: "Sikap",
    heading: "Dua kebiasaan yang membuat orang berhenti maju",
    paragraphs: [
      [
        "Yang pertama penilaian yang terlalu lunak. Aplikasi yang memuji kalimat berantakan memang enak dipakai, tetapi mahal harganya kalau dipercaya. Orang mengumpulkan tanda hijau berbulan bulan, lalu mendadak beku begitu penutur asli menjawab dengan kecepatan biasa. Masukannya memang tidak pernah cukup jujur untuk berguna.",
        "Kami mengambil jalan yang lain. Setiap rekaman dinilai pada empat sumbu terpisah, dan percobaan yang buruk diberi tahu bahwa hasilnya buruk, berikut satu perbaikan yang paling layak dikerjakan. Ini memang kurang nyaman. Ini juga satu satunya cara yang memperpendek jalannya.",
      ],
      [
        "Kebiasaan kedua sertifikat sekali pakai. Banyak penyedia kursus memberi PDF yang jaminannya cuma satu, yaitu perusahaan penerbitnya masih ada. Sekolah bubar, aplikasi berhenti, dan belajar bertahun tahun berubah menjadi klaim di riwayat hidup yang tidak bisa dipastikan siapa pun.",
        "Karena itu hasilnya kami terbitkan, bukan kami simpan. Ketika Anda lulus satu jenjang, bahasanya, jenjangnya, nilainya dan sidik jari percobaan yang dinilai ditulis ke Solana atas nama dompet Anda. Membacanya kembali hanya butuh tanda tangan dan satu alamat publik. Ini bekerja entah kami masih ada atau tidak, dan justru itulah maksudnya.",
      ],
      [
        "Selebihnya mengikuti dua keputusan itu. Harga dihitung per pelajaran yang selesai karena kami lebih suka dibayar atas pekerjaan yang benar benar dilakukan daripada atas perpanjangan yang terlupakan. Jalur anak tidak memakai rentetan harian maupun papan peringkat karena kami tidak mau menjual perangkap perhatian kepada orang tua dengan label pendidikan. Katalognya naik sampai HSK 6 dan CEFR C2 karena berhenti di kalimat liburan itu sudah jadi isi pasar, dan di situ justru orang tidak butuh bantuan.",
      ],
    ],
    ctaPrimary: "Uji sendiri penilaiannya",
    ctaSecondary: "Baca kode sumbernya",
  },
};

export const KIDS: Record<Locale, Kids> = {
  en: {
    metaTitle: "Kids and early years",
    metaDescription:
      "How Fluentia teaches children a language without streak pressure, leaderboards, or anything designed to keep them on the screen.",
    pill: "Early years",
    heading: "Built for a four-year-old without being built to keep them hooked",
    lead: "Most children's language apps are engagement products wearing an education label. We took the opposite position: short sessions, no streak pressure, and a syllabus that hands the child to the main ladder as soon as they are ready for it.",
    principles: [
      {
        title: "No streaks, no leaderboard",
        body: "Children do not need loss aversion engineered into their homework. Progress is shown as a map of what they can now say, and nothing is taken away for missing a day.",
      },
      {
        title: "Voice before letters",
        body: "Under seven, sessions run entirely on listening and speaking. A child who cannot yet read their own alphabet can still finish a lesson properly.",
      },
      {
        title: "Sessions end on their own",
        body: "Each lesson stops after roughly eight minutes and says so. There is no next-episode mechanic waiting to absorb the rest of the afternoon.",
      },
      {
        title: "A parent view that is one screen",
        body: "What was practised, what stuck, what is shaky. No dashboards to interpret and no notifications engineered to guilt anyone.",
      },
    ],
    routeHeading: "The route a young child takes",
    route: [
      { code: "K0", title: "Ears first", body: "Rhythm, song and imitation. The child copies sounds long before meaning is discussed." },
      { code: "K1", title: "Naming the world", body: "Family, food, animals, colours. Around 120 words, all through pictures and speech." },
      { code: "K2", title: "Short sentences", body: "Asking for things, answering simple questions, and holding a four-turn exchange." },
      { code: "YCT / A1", title: "Onto the main ladder", body: "From here the child moves into the same graded track an adult beginner uses." },
    ],
    ctaPrimary: "Try a first session",
    ctaSecondary: "See which languages are mapped",
  },
  id: {
    metaTitle: "Anak dan usia dini",
    metaDescription:
      "Cara Fluentia mengajar anak berbahasa tanpa tekanan rentetan harian, tanpa papan peringkat, dan tanpa apa pun yang dirancang menahan mereka di layar.",
    pill: "Usia dini",
    heading: "Dibuat untuk anak empat tahun, bukan untuk membuatnya lengket di layar",
    lead: "Sebagian besar aplikasi bahasa anak sebenarnya produk perebut perhatian yang memakai label pendidikan. Kami mengambil sikap sebaliknya: sesi pendek, tanpa tekanan rentetan harian, dan silabus yang menyerahkan anak ke jenjang utama begitu ia siap.",
    principles: [
      {
        title: "Tanpa rentetan harian, tanpa papan peringkat",
        body: "Anak tidak perlu rasa takut kehilangan yang sengaja dipasang di dalam pekerjaan rumahnya. Kemajuan ditampilkan sebagai peta hal hal yang sudah bisa ia ucapkan, dan tidak ada yang dicabut kalau ia absen sehari.",
      },
      {
        title: "Suara dulu, huruf belakangan",
        body: "Di bawah tujuh tahun, sesi berjalan sepenuhnya dengan mendengar dan berbicara. Anak yang belum bisa membaca abjadnya sendiri tetap bisa menyelesaikan pelajaran dengan utuh.",
      },
      {
        title: "Sesinya berhenti sendiri",
        body: "Setiap pelajaran berhenti sekitar delapan menit dan mengatakannya. Tidak ada mekanik episode berikutnya yang menunggu untuk menelan sisa sore itu.",
      },
      {
        title: "Tampilan orang tua cukup satu layar",
        body: "Apa yang dilatih, apa yang sudah melekat, apa yang masih goyah. Tidak ada dasbor yang perlu ditafsirkan dan tidak ada pemberitahuan yang dirancang membuat siapa pun merasa bersalah.",
      },
    ],
    routeHeading: "Jalur yang ditempuh anak kecil",
    route: [
      { code: "K0", title: "Telinga lebih dulu", body: "Irama, lagu dan menirukan. Anak menirukan bunyi jauh sebelum artinya dibicarakan." },
      { code: "K1", title: "Menamai sekelilingnya", body: "Keluarga, makanan, binatang, warna. Sekitar 120 kata, semuanya lewat gambar dan ucapan." },
      { code: "K2", title: "Kalimat pendek", body: "Meminta sesuatu, menjawab pertanyaan sederhana, dan bertahan dalam empat giliran percakapan." },
      { code: "YCT / A1", title: "Masuk ke jenjang utama", body: "Dari sini anak pindah ke jalur bernilai yang sama dengan yang dipakai pemula dewasa." },
    ],
    ctaPrimary: "Coba sesi pertama",
    ctaSecondary: "Lihat bahasa apa saja yang sudah dipetakan",
  },
};

export const TUTOR: Record<Locale, Tutor> = {
  en: {
    metaTitle: "Tutor",
    metaDescription:
      "Speak a line, get four separate scores back, and write the passing result to Solana devnet.",
    pill: "Tutor",
    heading: "The examiner is listening",
    lead: "Pick a language and a rung, ask for a line, then record yourself saying it. Accuracy, pronunciation, tone and fluency come back separately so you know which one is holding you back.",
    loading: "Loading the console…",
    sourceNote:
      "The lines are not improvised. Every drill the tutor sets is copied from the written syllabus behind this site — ten modules, unit by unit, with the grammar, the vocabulary and the exam task each unit feeds.",
    sourceLink: "Read the syllabus →",
  },
  id: {
    metaTitle: "Tutor",
    metaDescription:
      "Ucapkan satu kalimat, terima empat nilai terpisah, lalu tulis hasil yang lulus ke Solana devnet.",
    pill: "Tutor",
    heading: "Pengujinya sedang mendengarkan",
    lead: "Pilih bahasa dan jenjang, minta satu kalimat, lalu rekam suara Anda mengucapkannya. Ketepatan, pelafalan, nada dan kelancaran dikembalikan terpisah supaya Anda tahu bagian mana yang menahan Anda.",
    loading: "Memuat konsolnya…",
    sourceNote:
      "Kalimatnya tidak dikarang. Setiap latihan yang diberikan tutor disalin dari silabus tertulis di balik situs ini — sepuluh modul, unit demi unit, lengkap dengan tata bahasa, kosakata dan tugas ujian yang disiapkan tiap unit.",
    sourceLink: "Baca silabusnya →",
  },
};
