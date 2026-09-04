import type { Locale } from "@/lib/i18n";

/**
 * Pricing, credentials, coverage and the audit page.
 *
 * These four carry the claims a reader is most likely to want to argue with,
 * so the two languages have to say the same thing rather than merely cover the
 * same topics. Where the English hedges, the Indonesian hedges in the same
 * place.
 */

type Pricing = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  highlight: string;
  free: string;
  /** Plan wording, keyed by the plan name in curriculum.ts. Prices stay there. */
  plans: Record<string, { name: string; unit: string; tagline: string; features: string[]; cta: string }>;
  settlementHeading: string;
  settlement: [string, string][];
  notesHeading: string;
  notes: { q: string; a: string }[];
};

type Credentials = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  anatomyHeading: string;
  anatomy: { field: string; body: string }[];
  objectionsHeading: string;
  objections: { q: string; a: string }[];
};

type Coverage = {
  metaTitle: string;
  metaDescription: string;
  heading: string;
  lead: string;
  jsonNote: [string, string];
  stats: [string, string, string, string];
  columns: [string, string, string, string, string, string];
  written: string;
  tutorLed: string;
  thinHeading: string;
  thin: (modules: number, longTail: number) => string[];
};

type Audit = {
  metaTitle: string;
  metaDescription: string;
  pill: string;
  heading: string;
  lead: string;
  otherLanguage: string;
  widget: {
    heading: string;
    blurb: string;
    reading: string;
    of: (checked: number, total: number) => string;
    cannotRun: string;
    pass: string;
    failed: (count: number) => string;
    addresses: string;
    answered: string;
    didNot: string;
    took: string;
    failureHeading: string;
    noReply: string;
    sample: string;
    servingA: string;
    servingB: string;
    servingC: string;
  };
  complaintHeading: string;
  complaint: [string, string];
  claimsHeading: string;
  claimsLead: string;
  ifFalse: string;
  claims: { claim: string; check: string; fails: string }[];
  runHeading: string;
  runLead: string;
  runNote: string;
  limitsHeading: string;
  limits: string[];
  rungLimit: (written: number, total: number, units: number, longTail: number) => string;
  coverageLink: string;
  closing: string;
};

export const PRICING: Record<Locale, Pricing> = {
  en: {
    metaTitle: "Pricing",
    metaDescription:
      "Pay per finished lesson in USDC, or take a monthly seat. No subscription that quietly bills you through a month you did not study.",
    pill: "Pricing",
    heading: "You pay for lessons you finished, not months you meant to use",
    lead: "Settlement runs in USDC on Solana devnet, which makes a quarter-dollar charge economical in a way a card network never has been.",
    highlight: "What most people pick",
    free: "Free",
    plans: {
      Trial: {
        name: "Trial",
        unit: "",
        tagline: "Enough to know whether the tutor listens properly.",
        features: [
          "Three graded speaking rounds",
          "One placement diagnostic",
          "Full catalogue browsing",
          "Devnet wallet connect",
        ],
        cta: "Start without paying",
      },
      "Per lesson": {
        name: "Per lesson",
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
      },
      Cohort: {
        name: "Cohort",
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
      },
    },
    settlementHeading: "How settlement works",
    settlement: [
      ["Fund", "You transfer devnet USDC into a balance keyed to your wallet."],
      ["Draw", "Each completed lesson debits the agreed amount from that balance."],
      ["Withdraw", "Whatever is left returns to the funding wallet on request."],
    ],
    notesHeading: "Questions worth asking before you pay anything",
    notes: [
      {
        q: "Why not a normal monthly subscription?",
        a: "Because most of that revenue comes from people who stopped studying in week two and forgot to cancel. Charging by finished lesson means we only earn when the product was used.",
      },
      {
        q: "What is a lesson, exactly?",
        a: "One graded speaking round plus the tutor turns around it. If the grader fails or returns nothing usable, the round is not charged.",
      },
      {
        q: "Can I get my balance back?",
        a: "Yes. Unspent USDC sits in your own balance and withdraws to the wallet that funded it. We do not hold it hostage behind a support ticket.",
      },
      {
        q: "Is this real money right now?",
        a: "No. Everything here settles in devnet USDC, which has no value. The instruction flow is what a mainnet build would use, but nothing is charged.",
      },
    ],
  },
  id: {
    metaTitle: "Harga",
    metaDescription:
      "Bayar per pelajaran yang selesai dengan USDC, atau ambil langganan bulanan. Tidak ada langganan yang diam diam menagih Anda selama sebulan penuh yang tidak Anda pakai belajar.",
    pill: "Harga",
    heading: "Anda membayar pelajaran yang selesai, bukan bulan yang niatnya dipakai",
    lead: "Pembayaran diselesaikan dengan USDC di Solana devnet, sehingga tagihan seperempat dolar jadi masuk akal, hal yang tidak pernah bisa dilakukan jaringan kartu.",
    highlight: "Paling banyak dipilih",
    free: "Gratis",
    plans: {
      Trial: {
        name: "Coba dulu",
        unit: "",
        tagline: "Cukup untuk tahu apakah tutornya benar benar mendengarkan.",
        features: [
          "Tiga putaran bicara yang dinilai",
          "Satu tes penempatan",
          "Menjelajah seluruh katalog",
          "Menyambungkan dompet devnet",
        ],
        cta: "Mulai tanpa bayar",
      },
      "Per lesson": {
        name: "Per pelajaran",
        unit: "USDC / pelajaran",
        tagline: "Anda mengisi saldo, dan tiap pelajaran yang selesai memotongnya.",
        features: [
          "Ditagih hanya ketika satu pelajaran selesai",
          "Saldo yang belum terpakai bisa ditarik kapan saja",
          "Setiap nilai dicatat di Solana",
          "Penilaian ucapan dengan rincian nada",
          "Berlaku di seluruh 200+ jalur",
        ],
        cta: "Isi saldo",
      },
      Cohort: {
        name: "Kelas",
        unit: "USDC / bulan",
        tagline: "Untuk sekolah dan tim yang butuh kursi dan tampilan daftar peserta.",
        features: [
          "Pelajaran tanpa batas per kursi",
          "Daftar kelas dengan ekspor kemajuan",
          "Daftar sertifikat bersama",
          "Kurikulum selaras dengan HSK, JLPT, CEFR",
          "Pelunasan tagihan dengan USDC",
        ],
        cta: "Hubungi kami",
      },
    },
    settlementHeading: "Cara pembayarannya bekerja",
    settlement: [
      ["Isi", "Anda mengirim USDC devnet ke saldo yang terkunci pada dompet Anda."],
      ["Pakai", "Setiap pelajaran yang selesai memotong jumlah yang disepakati dari saldo itu."],
      ["Tarik", "Sisanya kembali ke dompet pengisi kapan pun diminta."],
    ],
    notesHeading: "Pertanyaan yang layak diajukan sebelum membayar apa pun",
    notes: [
      {
        q: "Kenapa bukan langganan bulanan biasa?",
        a: "Karena sebagian besar pendapatan model itu datang dari orang yang berhenti belajar di minggu kedua lalu lupa membatalkan. Menagih per pelajaran yang selesai berarti kami hanya dibayar ketika produknya benar benar dipakai.",
      },
      {
        q: "Satu pelajaran itu apa persisnya?",
        a: "Satu putaran bicara yang dinilai, berikut giliran tutor di sekitarnya. Kalau penilainya gagal atau tidak mengembalikan apa pun yang berguna, putaran itu tidak ditagih.",
      },
      {
        q: "Apakah saldo saya bisa kembali?",
        a: "Bisa. USDC yang belum terpakai ada di saldo Anda sendiri dan bisa ditarik ke dompet yang mengisinya. Kami tidak menahannya di balik tiket bantuan.",
      },
      {
        q: "Apakah ini uang sungguhan sekarang?",
        a: "Bukan. Semuanya diselesaikan dengan USDC devnet yang tidak bernilai. Alur instruksinya sama dengan yang akan dipakai versi mainnet, tetapi tidak ada yang ditagih.",
      },
    ],
  },
};

export const CREDENTIALS: Record<Locale, Credentials> = {
  en: {
    metaTitle: "Credentials",
    metaDescription:
      "How Fluentia writes a passed level to Solana, what goes on chain, and how to check a signature yourself.",
    pill: "Credentials",
    heading: "The part of your progress that does not depend on us",
    lead: "Passing a level produces a small public record signed by our registrar and addressed to your wallet. It is short by design: enough to confirm the claim, not enough to profile you.",
    anatomyHeading: "What actually goes on chain",
    anatomy: [
      { field: "Learner wallet", body: "The address that earned it. Nothing else identifies you: no name, no email, no audio." },
      { field: "Language and level", body: "Which ladder and which rung, written as the exam board writes it." },
      { field: "Score", body: "The composite mark out of one hundred. Sixty is the floor for issuing anything." },
      { field: "Attempt fingerprint", body: "A hash of the graded transcript. It proves a specific attempt without publishing what you said." },
      { field: "Timestamp", body: "When the level was cleared, so an old result can be read as an old result." },
    ],
    objectionsHeading: "The obvious objections",
    objections: [
      {
        q: "Could someone forge one?",
        a: "The transaction has to be signed by the registrar key. A memo written by any other wallet reads as unsigned and the verifier rejects it.",
      },
      {
        q: "What if Fluentia disappears?",
        a: "The record stays on Solana and the format is documented in the repository. Reading it needs a public RPC endpoint and nothing else.",
      },
      {
        q: "Is my voice stored anywhere?",
        a: "The recording is sent to the grader, scored, and dropped. What survives is the transcript hash, which cannot be turned back into audio.",
      },
      {
        q: "Why devnet and not mainnet?",
        a: "This build runs on devnet so the flow can be exercised without real money. The instruction set is unchanged on mainnet; only the cluster endpoint moves.",
      },
    ],
  },
  id: {
    metaTitle: "Sertifikat",
    metaDescription:
      "Cara Fluentia menulis jenjang yang lulus ke Solana, apa saja yang masuk ke rantai, dan cara memeriksa tanda tangannya sendiri.",
    pill: "Sertifikat",
    heading: "Bagian dari kemajuan Anda yang tidak bergantung pada kami",
    lead: "Lulus satu jenjang menghasilkan catatan publik kecil yang ditandatangani pencatat kami dan dialamatkan ke dompet Anda. Isinya memang pendek: cukup untuk memastikan klaimnya, tidak cukup untuk memprofilkan Anda.",
    anatomyHeading: "Apa yang benar benar masuk ke rantai",
    anatomy: [
      { field: "Dompet pembelajar", body: "Alamat yang memperolehnya. Tidak ada penanda lain: tanpa nama, tanpa surel, tanpa rekaman." },
      { field: "Bahasa dan jenjang", body: "Tangga yang mana dan jenjang yang mana, ditulis persis seperti lembaga ujiannya menulisnya." },
      { field: "Nilai", body: "Nilai gabungan dari seratus. Enam puluh adalah batas bawah untuk menerbitkan apa pun." },
      { field: "Sidik jari percobaan", body: "Hash dari teks yang dinilai. Ini membuktikan satu percobaan tertentu tanpa menerbitkan apa yang Anda ucapkan." },
      { field: "Waktu", body: "Kapan jenjang itu dilewati, supaya hasil lama bisa dibaca sebagai hasil lama." },
    ],
    objectionsHeading: "Keberatan yang wajar muncul",
    objections: [
      {
        q: "Bisakah orang memalsukannya?",
        a: "Transaksinya harus ditandatangani kunci pencatat. Memo yang ditulis dompet lain terbaca sebagai tidak bertanda tangan dan langsung ditolak pemeriksa.",
      },
      {
        q: "Bagaimana kalau Fluentia hilang?",
        a: "Catatannya tetap ada di Solana dan formatnya terdokumentasi di repositori. Membacanya hanya butuh satu alamat RPC publik, tidak ada syarat lain.",
      },
      {
        q: "Apakah suara saya disimpan di suatu tempat?",
        a: "Rekamannya dikirim ke penilai, dinilai, lalu dibuang. Yang tersisa hanya hash teksnya, dan itu tidak bisa dikembalikan menjadi suara.",
      },
      {
        q: "Kenapa devnet, bukan mainnet?",
        a: "Versi ini berjalan di devnet supaya alurnya bisa dijalankan tanpa uang sungguhan. Kumpulan instruksinya tidak berubah di mainnet; yang berpindah hanya alamat klasternya.",
      },
    ],
  },
};

export const COVERAGE: Record<Locale, Coverage> = {
  en: {
    metaTitle: "Coverage",
    metaDescription:
      "Every track and every rung in one table, with what sits behind each one and where it goes.",
    heading: "What is actually here",
    lead: "Every rung of every ladder, with the link it opens and what sits behind it. Rungs marked written have authored units and drill lines with numbered pinyin, which is what the tone grader measures against. The rest are taught by the tutor, grounded on the level descriptor rather than a written unit. Both are usable; they are not the same thing, so they are not counted as the same thing.",
    jsonNote: ["The same tree is served as JSON at", "if you would rather diff it than read it."],
    stats: ["tracks with a ladder", "rungs with written units", "authored units", "drill lines"],
    columns: ["Track", "Rung", "Material", "Units", "Lines", "Opens"],
    written: "written",
    tutorLed: "tutor-led",
    thinHeading: "Where it is thin",
    thin: (modules, longTail) => [
      `Written units exist for ${modules} modules across two tracks: HSK 1 through 6 in Mandarin, and Foundation through TOEFL 100 in English. Every other rung on this page runs on the tutor, which is grounded on the level descriptor and the track rather than on authored lines. That is a real difference for the two Chinese ladders: the tone grader reads its target out of numbered pinyin or jyutping, so on a tutor-led rung it is working from whatever romanisation the model supplied for the line it just set rather than from a line that was checked in advance.`,
      `Vietnamese does not have that problem, because Vietnamese writes its tones into the line itself and the grader reads them straight off the text. Two of its six are still marked as shared rather than separated: huyền against nặng, and sắc against ngã. Each of those pairs is told apart by a catch in the throat, not by a change in pitch, and pitch is the whole of what gets measured here. Both members are held to one target and the result says which distinction went unjudged, which is a smaller claim than the one a confident-looking number would have made.`,
      `The practice sets carry the same boundary. Questions are built from authored drill lines, so they exist for those ${modules} modules and nowhere else: a tutor-led rung has a conversation and a speaking grade, but no multiple choice, no gap fills, no listening, no handwriting and no sentence building, because there are no written lines to make them out of.`,
      `A further ${longTail} languages are reachable in the tutor without a ladder of their own. They are listed on the catalogue as what they are, conversation practice, and are deliberately absent from the table above, which counts rungs, not languages.`,
    ],
  },
  id: {
    metaTitle: "Cakupan",
    metaDescription:
      "Semua jalur dan semua jenjang dalam satu tabel, lengkap dengan isi di baliknya dan alamat yang dibukanya.",
    heading: "Apa yang benar benar ada di sini",
    lead: "Setiap jenjang dari setiap tangga, berikut tautan yang dibukanya dan apa yang ada di baliknya. Jenjang bertanda tertulis punya unit dan baris latihan dengan pinyin bernomor, dan itulah yang dipakai penilai nada sebagai acuan. Sisanya diajar tutor, berpijak pada deskripsi jenjangnya, bukan pada unit tertulis. Keduanya bisa dipakai, tetapi bukan hal yang sama, jadi tidak dihitung sebagai hal yang sama.",
    jsonNote: ["Pohon yang sama disajikan sebagai JSON di", "kalau Anda lebih suka membandingkannya daripada membacanya."],
    stats: ["jalur yang punya tangga", "jenjang dengan unit tertulis", "unit yang ditulis", "baris latihan"],
    columns: ["Jalur", "Jenjang", "Materi", "Unit", "Baris", "Membuka"],
    written: "tertulis",
    tutorLed: "dipandu tutor",
    thinHeading: "Bagian yang masih tipis",
    thin: (modules, longTail) => [
      `Unit tertulis baru ada untuk ${modules} modul di dua jalur: HSK 1 sampai 6 untuk Mandarin, dan Foundation sampai TOEFL 100 untuk Inggris. Semua jenjang lain di halaman ini berjalan dengan tutor, yang berpijak pada deskripsi jenjang dan jalurnya, bukan pada baris yang sudah ditulis. Untuk dua tangga bahasa Tionghoa, ini perbedaan yang nyata: penilai nada membaca targetnya dari pinyin atau jyutping bernomor, jadi pada jenjang yang dipandu tutor ia bekerja dari romanisasi apa pun yang baru saja disediakan model untuk kalimat itu, bukan dari baris yang sudah diperiksa lebih dulu.`,
      `Bahasa Vietnam tidak punya masalah itu, karena nadanya ditulis langsung di dalam kalimatnya dan penilai membacanya lurus dari teks. Dua dari enam nadanya masih ditandai digabung, bukan dipisah: huyền dengan nặng, dan sắc dengan ngã. Tiap pasangan itu dibedakan oleh hentakan di tenggorokan, bukan oleh perubahan tinggi nada, padahal tinggi nada itulah keseluruhan yang diukur di sini. Kedua anggotanya dipegang pada satu target, dan hasilnya menyebutkan pembedaan mana yang tidak dinilai. Itu klaim yang lebih kecil daripada yang akan disampaikan sebuah angka yang terlihat meyakinkan.`,
      `Set latihannya punya batas yang sama. Soalnya disusun dari baris latihan yang ditulis, jadi soal hanya ada untuk ${modules} modul itu dan tidak di tempat lain: jenjang yang dipandu tutor tetap punya percakapan dan penilaian bicara, tetapi tanpa pilihan ganda, tanpa isian, tanpa menyimak, tanpa tulis tangan, dan tanpa susun kalimat, karena tidak ada baris tertulis untuk membuatnya.`,
      `Ada ${longTail} bahasa lagi yang bisa dijangkau lewat tutor tanpa tangga sendiri. Di katalog semuanya dicantumkan apa adanya, yaitu latihan percakapan, dan sengaja tidak dimasukkan ke tabel di atas, karena tabel itu menghitung jenjang, bukan bahasa.`,
    ],
  },
};

export const AUDIT: Record<Locale, Audit> = {
  en: {
    metaTitle: "Audit",
    metaDescription:
      "How to check the claims on this site without taking any of them on trust: a live link audit, the test suites, and what each one would look like if it failed.",
    pill: "Audit",
    heading: "Checking this without taking our word for it",
    lead: "Everything below can be verified by someone who does not trust the people who built it. The check at the top runs by itself when this page opens. The rest can be run from a clone in about two minutes.",
    otherLanguage: "Tersedia juga dalam Bahasa Indonesia",
    widget: {
      heading: "Every address, checked from this browser",
      blurb:
        "This ran when the page opened. It asked this deployment for every page the catalogue links to, in both languages, one request each, and counted what came back. Nothing here was typed in ahead of time.",
      reading: "reading the address list",
      of: (checked, total) => `${checked} of ${total}`,
      cannotRun: "could not run",
      pass: "pass",
      failed: (count) => `${count} failed`,
      addresses: "Addresses",
      answered: "Answered 200",
      didNot: "Did not",
      took: "Took",
      failureHeading: "These did not answer. The claim above does not hold for them.",
      noReply: "no reply",
      sample:
        "Eleven of them, taken at even intervals through the list, if you would rather click than take the count on trust.",
      servingA: "What you just audited is commit",
      servingB: "grading speech through",
      servingC:
        "The same commit is on GitHub, so the pages that answered above can be read as source.",
    },
    complaintHeading: "About the report that the modules would not open",
    complaint: [
      "That was worth reporting and the check above exists because of it. Two things had gone wrong. The catalogue offered rungs that had no page behind them, so a card that looked interactive did nothing. Separately, the address being read was not always the address the latest work had been deployed to, so a fix could be live somewhere and absent here at the same time.",
      "Both are closed now, and neither is closed by assertion. Every rung resolves either to an authored module or to the tutor opened at that level, and the audit above walks all of them from your machine. The deployment says which commit it is running, and a deploy that cannot move the canonical address now fails rather than reporting success.",
    ],
    claimsHeading: "What is claimed, and what would disprove it",
    claimsLead:
      "The third column is the one that matters. A claim that nothing could contradict is not evidence of anything. Two of these have caught real faults, and both are noted as such.",
    ifFalse: "If it were false: ",
    claims: [
      {
        claim: "Every module and every rung opens a real page, in both languages.",
        check: "The audit above, run in your browser. Also links-proof, which rebuilds the address list from the repository, asks the deployment for each one, and compares its list against the one the audit above walked.",
        fails: "The failing address is printed with its status code. If the two lists have drifted, that is reported as a failure of its own, because a count is worth nothing when the set behind it is unclear.",
      },
      {
        claim: "Tone scoring measures pitch, and can tell tones apart.",
        check: "tone-proof, cantonese-proof, vietnamese-proof. Each synthesises an utterance with known tones, scores it, then mislabels it and requires the score to drop.",
        fails: "A mislabelled utterance scores as well as a correct one, which would mean the grader is reading the transcript and not the pitch.",
      },
      {
        claim: "Review scheduling follows SM-2, not a streak counter.",
        check: "srs-proof, twenty-two assertions on the interval ladder, the ease floor, and what a lapse does. deck-proof runs thirty simulated days.",
        fails: "An interval that grows when it should reset, or an ease that rises on an imperfect answer.",
      },
      {
        claim: "The written syllabus can actually be graded.",
        check: "content-proof walks every authored unit and requires each drill line to carry the numbered pinyin the tone grader needs.",
        fails: "A unit that reads well on the page but cannot be scored, which is the failure mode worth catching.",
      },
      {
        claim: "No question in the practice sets was written by a model.",
        check: "exercises-proof builds every question in all ten modules and requires each one to cite a drill line that exists, to carry exactly one correct answer, and to reject each of its own distractors. It walks the whole set rather than sampling it.",
        fails: "A question with two right answers, none, or an answer that appears nowhere in the syllabus. Any of those would mean the question came from somewhere other than the authored units.",
      },
      {
        claim: "Payment arithmetic is correct and a transaction cannot be replayed.",
        check: "settle-proof offline, replay-proof against Solana devnet with a real signature submitted twice.",
        fails: "A second submission of the same signature is accepted, or a balance that does not reconcile.",
      },
      {
        claim: "The address you are reading is the code on GitHub.",
        check: "deployed-proof asks /api/build for the commit and compares it with the repository.",
        fails: "The URL reports a commit nobody can produce. This one has fired: an alias had drifted and a suite spent a run auditing code that was never shipped here.",
      },
      {
        claim: "The speaking pipeline works end to end, not just in tests.",
        check: "speech-proof sends real audio to the live deployment and requires a transcript and a score back.",
        fails: "A provider outage or a retired model. This one has fired too.",
      },
    ],
    runHeading: "Running all of it yourself",
    runLead:
      "The first command needs nothing but Node. It runs the eight suites that do not touch the network and finishes in a few seconds.",
    runNote:
      "The last command needs API credentials in .env.local and a devnet connection, because those suites are about a live system rather than about the source. It prints one line per suite and a count at the end. Anything red is a real failure and is meant to be read as one.",
    limitsHeading: "What this does not do",
    limits: [
      "Settlement runs on Solana devnet. The balances are test funds and no money changes hands. The instruction flow is what a mainnet build would use, but calling it revenue would be false.",
      "Progress is kept in your browser, not on a server. Clearing site data clears it. There are no accounts.",
      "Recordings are graded and dropped. What survives an attempt is a hash of the transcript, which cannot be turned back into audio.",
      "The interface exists in English and Indonesian, the tutor console included, and the tutor is told to explain in whichever of the two you are reading. What is not translated is the written syllabus: unit titles, grammar points and glosses were authored in English and are still only in English. That is a body of writing rather than a set of labels, and running it through a machine would leave a learner studying from prose nobody had checked, so it is left as it is and said so here.",
    ],
    rungLimit: (written, total, units) =>
      `${written} of ${total} rungs carry authored units, ${units} of them in total. The rest are taught by the tutor from the level descriptor. Both work; they are not the same thing.`,
    coverageLink: "the coverage table",
    closing:
      "If something here does not hold up, the failing case is the useful thing to send back. The suites are written so that a fault names itself, and a report of the shape “this address returned 404” is enough to act on.",
  },

  id: {
    metaTitle: "Audit",
    metaDescription:
      "Cara memeriksa klaim di situs ini tanpa mempercayainya begitu saja: pemeriksaan tautan langsung, kumpulan ujinya, dan seperti apa tampilannya kalau salah satu gagal.",
    pill: "Audit",
    heading: "Cara memeriksa situs ini sendiri",
    lead: "Semua yang ada di bawah bisa diperiksa oleh orang yang tidak mempercayai pembuatnya. Pemeriksaan di bagian atas berjalan sendiri begitu halaman ini terbuka. Sisanya bisa dijalankan dari salinan repositori dalam waktu sekitar dua menit.",
    otherLanguage: "Also available in English",
    widget: {
      heading: "Setiap alamat, diperiksa dari peramban ini",
      blurb:
        "Pemeriksaan ini berjalan ketika halaman terbuka. Ia meminta setiap halaman yang ditautkan katalog kepada penyebaran ini, dalam kedua bahasa, satu permintaan untuk masing masing, lalu menghitung jawabannya. Tidak ada angka di sini yang diketik lebih dulu.",
      reading: "membaca daftar alamat",
      of: (checked, total) => `${checked} dari ${total}`,
      cannotRun: "tidak bisa dijalankan",
      pass: "lulus",
      failed: (count) => `${count} gagal`,
      addresses: "Alamat",
      answered: "Menjawab 200",
      didNot: "Tidak menjawab",
      took: "Waktu",
      failureHeading: "Alamat ini tidak menjawab. Klaim di atas tidak berlaku untuknya.",
      noReply: "tanpa jawaban",
      sample:
        "Sebelas di antaranya, diambil pada jarak yang merata sepanjang daftar, kalau Anda lebih suka mengklik sendiri daripada memercayai hitungannya.",
      servingA: "Yang baru saja Anda periksa adalah commit",
      servingB: "menilai ucapan lewat",
      servingC:
        "Commit yang sama ada di GitHub, jadi halaman yang menjawab di atas bisa dibaca sebagai kode sumber.",
    },
    complaintHeading: "Soal laporan bahwa modulnya tidak bisa dibuka",
    complaint: [
      "Laporan itu pantas disampaikan, dan pemeriksaan di atas ada justru karenanya. Ada dua hal yang salah. Katalog menawarkan jenjang yang belum punya halaman di baliknya, jadi kartunya terlihat bisa ditekan tetapi tidak membuka apa apa. Terpisah dari itu, alamat yang dibaca tidak selalu alamat yang menerima pekerjaan terakhir, jadi sebuah perbaikan bisa sudah hidup di satu tempat dan belum ada di sini pada saat yang sama.",
      "Keduanya sudah ditutup, dan tidak satu pun ditutup lewat pernyataan. Setiap jenjang bermuara ke modul yang ditulis atau ke tutor yang sudah dibuka pada jenjang itu, dan pemeriksaan di atas menyusuri semuanya dari komputer Anda. Penyebarannya menyebutkan commit mana yang sedang dijalankan, dan proses penyebaran yang gagal memindahkan alamat utamanya kini berhenti dengan status gagal, bukan melaporkan berhasil.",
    ],
    claimsHeading: "Yang diklaim, dan apa yang akan mematahkannya",
    claimsLead:
      "Kolom ketiga itulah yang penting. Klaim yang tidak mungkin dibantah apa pun bukan bukti atas apa pun. Dua di antaranya sudah pernah menangkap kesalahan nyata, dan keduanya dicatat begitu.",
    ifFalse: "Kalau klaimnya salah: ",
    claims: [
      {
        claim: "Setiap modul dan setiap jenjang membuka halaman nyata, dalam kedua bahasa.",
        check: "Pemeriksaan di atas, dijalankan di peramban Anda. Juga links-proof, yang menyusun ulang daftar alamatnya dari repositori, meminta tiap alamat ke penyebaran ini, lalu membandingkan daftarnya dengan daftar yang disusuri pemeriksaan di atas.",
        fails: "Alamat yang gagal dicetak berikut kode statusnya. Kalau kedua daftar itu sudah tidak sama, hal itu dilaporkan sebagai kegagalan tersendiri, karena sebuah hitungan tidak ada artinya kalau himpunan di baliknya tidak jelas.",
      },
      {
        claim: "Penilaian nada mengukur tinggi rendah suara, dan bisa membedakan nada.",
        check: "tone-proof, cantonese-proof, vietnamese-proof. Masing masing menyusun ucapan dengan nada yang diketahui, menilainya, lalu sengaja memberinya label salah dan menuntut nilainya turun.",
        fails: "Ucapan berlabel salah mendapat nilai sebaik yang berlabel benar, yang berarti penilainya membaca teks, bukan tinggi nadanya.",
      },
      {
        claim: "Penjadwalan pengulangan mengikuti SM-2, bukan penghitung rentetan harian.",
        check: "srs-proof, dua puluh dua pemeriksaan atas tangga jeda, batas bawah kemudahan, dan akibat sebuah kelalaian. deck-proof menjalankan tiga puluh hari simulasi.",
        fails: "Jeda yang justru memanjang ketika seharusnya kembali ke awal, atau nilai kemudahan yang naik pada jawaban yang belum sempurna.",
      },
      {
        claim: "Silabus yang tertulis memang bisa dinilai.",
        check: "content-proof menyusuri setiap unit yang ditulis dan menuntut tiap baris latihan membawa pinyin bernomor yang dibutuhkan penilai nada.",
        fails: "Unit yang enak dibaca di halaman tetapi tidak bisa dinilai, dan justru itulah bentuk kegagalan yang layak ditangkap.",
      },
      {
        claim: "Tidak ada satu pun soal latihan yang ditulis oleh model.",
        check: "exercises-proof menyusun setiap soal di kesepuluh modul lalu menuntut tiap soal merujuk baris latihan yang benar benar ada, memuat tepat satu jawaban benar, dan menolak semua pengecohnya sendiri. Seluruh himpunannya ditelusuri, bukan disampel.",
        fails: "Soal dengan dua jawaban benar, tanpa jawaban benar, atau jawaban yang tidak ada di silabus mana pun. Ketiganya berarti soal itu datang dari luar unit yang ditulis.",
      },
      {
        claim: "Hitungan pembayaran benar dan transaksinya tidak bisa diulang.",
        check: "settle-proof secara luring, replay-proof langsung di Solana devnet dengan satu tanda tangan asli yang dikirim dua kali.",
        fails: "Pengiriman kedua dengan tanda tangan yang sama diterima, atau saldo yang tidak cocok.",
      },
      {
        claim: "Alamat yang Anda buka adalah kode yang ada di GitHub.",
        check: "deployed-proof menanyakan commit ke /api/build dan membandingkannya dengan repositori.",
        fails: "Alamatnya menyebut commit yang tidak bisa dihasilkan siapa pun. Yang ini pernah terjadi: sebuah alias sudah bergeser, dan satu putaran uji habis memeriksa kode yang tidak pernah dikirim ke sini.",
      },
      {
        claim: "Alur bicaranya bekerja dari ujung ke ujung, bukan cuma di dalam uji.",
        check: "speech-proof mengirim rekaman sungguhan ke penyebaran langsung dan menuntut kembalinya teks beserta nilainya.",
        fails: "Gangguan pada penyedia layanan atau model yang sudah dipensiunkan. Yang ini juga pernah terjadi.",
      },
    ],
    runHeading: "Menjalankan semuanya sendiri",
    runLead:
      "Perintah pertama tidak butuh apa apa selain Node. Ia menjalankan delapan kumpulan uji yang tidak menyentuh jaringan dan selesai dalam hitungan detik.",
    runNote:
      "Perintah terakhir butuh kredensial API di .env.local dan sambungan devnet, karena kumpulan uji itu berbicara tentang sistem yang hidup, bukan tentang kode sumbernya. Hasilnya satu baris per kumpulan uji dan satu hitungan di akhir. Baris merah berarti kegagalan sungguhan dan memang dimaksudkan untuk dibaca begitu.",
    limitsHeading: "Yang belum dilakukan di sini",
    limits: [
      "Pembayaran berjalan di Solana devnet. Saldonya dana uji dan tidak ada uang yang berpindah. Alur instruksinya sama dengan yang akan dipakai versi mainnet, tetapi menyebutnya pendapatan jelas keliru.",
      "Kemajuan belajar disimpan di peramban Anda, bukan di server. Menghapus data situs akan menghapusnya. Tidak ada akun.",
      "Rekaman dinilai lalu dibuang. Yang tersisa dari sebuah percobaan adalah hash teksnya, dan itu tidak bisa dikembalikan menjadi suara.",
      "Antarmukanya tersedia dalam bahasa Inggris dan Indonesia, termasuk konsol tutor, dan tutornya diminta menjelaskan dalam bahasa yang sedang Anda baca. Yang belum diterjemahkan adalah silabus tertulisnya: judul unit, butir tata bahasa, dan penjelasan artinya ditulis dalam bahasa Inggris dan masih hanya ada dalam bahasa itu. Itu satu badan tulisan, bukan sekumpulan label, dan menerjemahkannya dengan mesin akan membuat pelajar belajar dari kalimat yang belum diperiksa siapa pun, jadi dibiarkan apa adanya dan disebutkan di sini.",
    ],
    rungLimit: (written, total, units) =>
      `Dari ${total} jenjang, ${written} sudah membawa unit tertulis, seluruhnya ${units} unit. Sisanya diajar tutor berdasarkan deskripsi jenjangnya. Keduanya bisa dipakai, tetapi bukan hal yang sama.`,
    coverageLink: "tabel cakupan",
    closing:
      "Kalau ada yang tidak sesuai, bagian yang gagal itulah yang paling berguna untuk dikirim balik. Kumpulan ujinya ditulis supaya kesalahannya menyebut dirinya sendiri, dan laporan sesederhana “alamat ini menjawab 404” sudah cukup untuk ditindaklanjuti.",
  },
};
