import type { Locale } from "@/lib/i18n";

type Home = {
  badge: string;
  titleTop: string;
  titleAccent: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: [string, string][];
  pillarsHeading: string;
  pillars: { tag: string; title: string; body: string }[];
  ladderEyebrow: string;
  ladderHeading: string;
  ladder: { age: string; label: string; body: string }[];
  featuredHeading: string;
  featuredMore: string;
  stepsHeading: string;
  steps: { n: string; title: string; body: string }[];
  proofEyebrow: string;
  proofHeading: string;
  proofBody: [string, string];
  proofCta: string;
  memoLabel: string;
  closingHeading: string;
  closingBody: string;
  closingCta: string;
};

export const HOME: Record<Locale, Home> = {
  en: {
    badge: "Running on Solana devnet",
    titleTop: "Learn the language.",
    titleAccent: "Keep the proof.",
    lead: "A speaking tutor that marks you the way an examiner would, across two hundred languages and every rung from a child copying sounds to an adult sitting HSK 6. Clear a level and the result is written to a public ledger, so it still means something away from this site.",
    ctaPrimary: "Speak your first line",
    ctaSecondary: "Browse the catalogue",
    stats: [
      ["200+", "languages open"],
      ["HSK 6", "top rung on Mandarin"],
      ["0.25", "USDC for one lesson"],
    ],
    pillarsHeading: "Four things most language apps get wrong",
    pillars: [
      {
        tag: "Grading",
        title: "It listens, then it marks you down",
        body: "Whisper transcribes, then an examiner scores accuracy, pronunciation, tone and fluency as four separate numbers. Nothing is rounded up to keep you comfortable.",
      },
      {
        tag: "Curriculum",
        title: "The ladder does not stop at tourist phrases",
        body: "Mandarin runs HSK 1 to 6 with YCT alongside it for children. Other tracks follow CEFR, JLPT and TOPIK as the boards publish them.",
      },
      {
        tag: "Proof",
        title: "A result you keep after you cancel",
        body: "Clear a level and the score, the level and a fingerprint of the attempt go to Solana under your wallet. The record outlives our servers.",
      },
      {
        tag: "Money",
        title: "Pay for the lesson, not the calendar",
        body: "Each finished lesson draws from a small USDC balance. Stop for three months and you owe nothing; what is left withdraws on request.",
      },
    ],
    ladderEyebrow: "One catalogue, five life stages",
    ladderHeading: "A toddler and an HSK 6 candidate share one account",
    ladder: [
      { age: "3-6", label: "Sound play", body: "Songs and picture prompts. No reading, no keyboard, no reward loop built to hook a child." },
      { age: "7-12", label: "Story lessons", body: "Short narratives answered out loud, with progress notes a parent reads in a minute." },
      { age: "Teen+", label: "Grammar in use", body: "Rules taught inside conversation rather than handed over as tables to memorise." },
      { age: "Work", label: "Operating level", body: "Meetings, negotiation and correspondence, marked on register rather than vocabulary count." },
      { age: "Exam", label: "Certification tier", body: "HSK 6, CEFR C2, JLPT N1. Timed drills, essay marking, a mock oral with an unforgiving rubric." },
    ],
    featuredHeading: "Start with one of these",
    featuredMore: "See every track",
    stepsHeading: "From a first spoken line to a result someone else can check",
    steps: [
      { n: "01", title: "Pick a language and a rung", body: "Or sit the two-minute placement, so the tutor stops spending your time on material you already own." },
      { n: "02", title: "Speak the line you are given", body: "One tap records. Transcript and four sub-scores land in a couple of seconds." },
      { n: "03", title: "Clear the level", body: "Sixty or better across the checkpoints unlocks the credential." },
      { n: "04", title: "Anchor it to your wallet", body: "The record goes to Solana devnet. Hand over the signature and anyone can read it back." },
    ],
    proofEyebrow: "Why involve a ledger at all",
    proofHeading: "A certificate is only worth the company standing behind it",
    proofBody: [
      "Language schools close and apps shut down. The PDF you were issued becomes a picture of a claim nobody can check, and the person who did the work absorbs the loss.",
      "Fluentia writes the level, the score and a hash of the graded attempt to Solana under your wallet. No audio leaves the grader, and reading the record needs no account. A recruiter holding the signature confirms it in a browser tab.",
    ],
    proofCta: "Verify a credential",
    memoLabel: "memo record · devnet",
    closingHeading: "Say one line and see what the examiner makes of it",
    closingBody: "Three graded rounds, no wallet, no cost. If the feedback is not sharper than what you are used to, close the tab.",
    closingCta: "Open the tutor",
  },

  id: {
    badge: "Berjalan di Solana devnet",
    titleTop: "Kuasai bahasanya.",
    titleAccent: "Simpan buktinya.",
    lead: "Tutor bicara yang menilai Anda seperti penguji sungguhan, untuk dua ratus bahasa dan setiap jenjang, dari anak kecil yang menirukan bunyi sampai orang dewasa yang menghadapi HSK 6. Lulus satu jenjang dan hasilnya ditulis ke catatan publik, jadi nilainya tetap berarti di luar situs ini.",
    ctaPrimary: "Ucapkan kalimat pertama",
    ctaSecondary: "Lihat katalognya",
    stats: [
      ["200+", "bahasa tersedia"],
      ["HSK 6", "jenjang tertinggi Mandarin"],
      ["0,25", "USDC per pelajaran"],
    ],
    pillarsHeading: "Empat hal yang biasanya keliru di aplikasi bahasa",
    pillars: [
      {
        tag: "Penilaian",
        title: "Didengarkan dulu, baru dinilai apa adanya",
        body: "Whisper menuliskan ucapan Anda, lalu penguji memberi nilai ketepatan, pelafalan, nada dan kelancaran sebagai empat angka terpisah. Tidak ada yang dibulatkan ke atas supaya Anda senang.",
      },
      {
        tag: "Kurikulum",
        title: "Jenjangnya tidak berhenti di kalimat turis",
        body: "Mandarin berjalan dari HSK 1 sampai 6, dengan YCT untuk anak. Jalur lain mengikuti CEFR, JLPT dan TOPIK sesuai yang diterbitkan lembaganya.",
      },
      {
        tag: "Bukti",
        title: "Hasil yang tetap milik Anda setelah berhenti",
        body: "Lulus satu jenjang, lalu nilai, jenjang dan sidik jari percobaannya dikirim ke Solana atas nama dompet Anda. Catatannya bertahan lebih lama daripada server kami.",
      },
      {
        tag: "Biaya",
        title: "Bayar pelajarannya, bukan kalendernya",
        body: "Setiap pelajaran yang selesai memotong sedikit saldo USDC. Berhenti tiga bulan dan Anda tidak berutang apa pun; sisanya bisa ditarik kapan saja.",
      },
    ],
    ladderEyebrow: "Satu katalog, lima tahap usia",
    ladderHeading: "Anak balita dan peserta HSK 6 memakai satu akun yang sama",
    ladder: [
      { age: "3-6", label: "Bermain bunyi", body: "Lagu dan gambar. Belum perlu membaca, tanpa papan ketik, tanpa putaran hadiah yang dirancang mengikat anak." },
      { age: "7-12", label: "Belajar lewat cerita", body: "Cerita pendek yang dijawab dengan suara, dengan catatan kemajuan yang bisa dibaca orang tua dalam semenit." },
      { age: "Remaja+", label: "Tata bahasa terpakai", body: "Aturan diajarkan di dalam percakapan, bukan diserahkan sebagai tabel untuk dihafal." },
      { age: "Kerja", label: "Tingkat operasional", body: "Rapat, negosiasi dan surat menyurat, dinilai dari ketepatan ragam bahasa, bukan dari jumlah kosakata." },
      { age: "Ujian", label: "Tingkat sertifikasi", body: "HSK 6, CEFR C2, JLPT N1. Latihan berwaktu, penilaian esai, dan simulasi lisan dengan rubrik yang keras." },
    ],
    featuredHeading: "Mulai dari salah satu ini",
    featuredMore: "Lihat semua jalur",
    stepsHeading: "Dari kalimat pertama sampai hasil yang bisa diperiksa orang lain",
    steps: [
      { n: "01", title: "Pilih bahasa dan jenjang", body: "Atau ikuti tes penempatan dua menit, supaya tutor tidak menghabiskan waktu Anda pada materi yang sudah Anda kuasai." },
      { n: "02", title: "Ucapkan kalimat yang diberikan", body: "Satu ketukan untuk merekam. Teks dan empat nilai rincinya keluar dalam beberapa detik." },
      { n: "03", title: "Lulus jenjangnya", body: "Nilai enam puluh ke atas di seluruh titik periksa membuka sertifikatnya." },
      { n: "04", title: "Kaitkan ke dompet Anda", body: "Catatannya masuk ke Solana devnet. Serahkan tanda tangannya dan siapa pun bisa membacanya kembali." },
    ],
    proofEyebrow: "Kenapa harus melibatkan catatan publik",
    proofHeading: "Sertifikat hanya sekuat lembaga yang berdiri di belakangnya",
    proofBody: [
      "Sekolah bahasa tutup dan aplikasi berhenti beroperasi. PDF yang dulu Anda terima berubah menjadi gambar dari sebuah klaim yang tidak bisa diperiksa siapa pun, dan yang menanggung ruginya adalah orang yang sudah bekerja keras.",
      "Fluentia menulis jenjang, nilai dan sidik jari percobaan yang dinilai ke Solana atas nama dompet Anda. Tidak ada rekaman yang keluar dari penilai, dan membaca catatannya tidak butuh akun. Perekrut yang memegang tanda tangannya bisa memastikannya lewat satu tab peramban.",
    ],
    proofCta: "Verifikasi sebuah sertifikat",
    memoLabel: "catatan memo · devnet",
    closingHeading: "Ucapkan satu kalimat dan lihat penilaian pengujinya",
    closingBody: "Tiga putaran bernilai, tanpa dompet, tanpa biaya. Kalau masukannya tidak lebih tajam daripada yang biasa Anda terima, tutup saja tabnya.",
    closingCta: "Buka tutornya",
  },
};
