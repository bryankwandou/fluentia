import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Ringkasan audit",
  description:
    "Penjelasan singkat dalam Bahasa Indonesia tentang apa yang dibangun, apa yang bisa diperiksa sendiri, dan apa yang belum ada.",
};

/**
 * Companion to /audit for a reader who would rather not work through the
 * English. Same claims, same numbers, drawn from the same data so the two
 * cannot say different things.
 */
const PEMERIKSAAN = [
  {
    apa: "Semua modul dan setiap jenjang membuka halaman yang nyata.",
    cara: "Buka halaman audit. Pemeriksaan berjalan sendiri dan menghitung setiap alamat dari peramban Anda.",
  },
  {
    apa: "Penilaian nada mengukur tinggi rendah suara, bukan menebak dari teks.",
    cara: "Uji tone-proof, cantonese-proof, dan vietnamese-proof. Rekaman yang sengaja diberi label salah harus turun nilainya.",
  },
  {
    apa: "Jadwal pengulangan memakai SM-2, bukan penghitung rentetan harian.",
    cara: "Uji srs-proof, dua puluh dua pemeriksaan, dan deck-proof yang menjalankan tiga puluh hari.",
  },
  {
    apa: "Pembayaran tidak bisa diulang dua kali dengan tanda tangan yang sama.",
    cara: "Uji replay-proof, dijalankan langsung di Solana devnet.",
  },
  {
    apa: "Alamat yang Anda buka adalah kode yang ada di GitHub.",
    cara: "Uji deployed-proof, membandingkan commit di /api/build dengan isi repositori.",
  },
];

const BATASAN = [
  "Pembayaran berjalan di Solana devnet. Saldonya dana uji, bukan uang sungguhan, dan tidak ada transaksi bernilai.",
  "Kemajuan belajar disimpan di peramban, bukan di server. Menghapus data situs menghapusnya. Tidak ada akun.",
  "Rekaman suara dinilai lalu dibuang. Yang tersimpan hanya sidik jari teksnya, dan itu tidak bisa dikembalikan menjadi suara.",
];

export default function RingkasanPage() {
  const rows = TRACKS.flatMap((track) =>
    track.levels.map((level) => {
      const slug = slugifyModule(level.code);
      const found = getModule(slug);
      return { written: found?.track === track.slug ? found : null };
    })
  );
  const tertulis = rows.filter((row) => row.written).length;
  const unit = ALL_MODULES.reduce((sum, module) => sum + module.units.length, 0);

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Ringkasan</span>
          <h1 className="mt-5 text-[clamp(1.9rem,4.4vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            Cara memeriksa situs ini sendiri
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            Halaman ini merangkum{" "}
            <Link href="/audit" className="text-jade-300 underline underline-offset-4">
              halaman audit
            </Link>{" "}
            dalam Bahasa Indonesia. Angkanya diambil dari data yang sama, jadi
            keduanya tidak mungkin menyebut jumlah yang berbeda.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14">
            <h2 className="text-[clamp(1.3rem,2.8vw,1.8rem)] font-semibold tracking-[-0.03em]">
              Soal laporan bahwa modulnya tidak bisa diklik
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Laporan itu benar dan pantas disampaikan. Ada dua hal yang salah.
              Pertama, katalog menampilkan jenjang yang belum punya halaman, jadi
              kartunya terlihat bisa ditekan tetapi tidak membuka apa pun. Kedua,
              alamat yang dibaca tidak selalu alamat yang menerima perbaikan
              terakhir, jadi sebuah perbaikan bisa sudah ada di satu tempat dan
              belum ada di tempat yang dibuka.
            </p>
            <p className="mt-3.5 text-[15px] leading-relaxed text-muted">
              Keduanya sudah ditutup, dan bukan dengan pernyataan. Halaman audit
              meminta satu per satu setiap alamat dari peramban Anda dan
              menyebutkan mana yang gagal beserta kodenya. Kalau tidak ada yang
              gagal, angkanya berasal dari permintaan yang benar benar terjadi di
              komputer Anda, bukan dari kalimat yang kami ketik.
            </p>
            <Link href="/audit" className="btn btn-primary mt-7 inline-flex px-5 py-3 text-sm">
              Buka pemeriksaannya
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mt-16 text-[clamp(1.3rem,2.8vw,1.8rem)] font-semibold tracking-[-0.03em]">
            Yang diklaim, dan cara mengujinya
          </h2>
        </Reveal>

        <Stagger className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {PEMERIKSAAN.map((row) => (
            <StaggerItem key={row.apa} className="bg-ink-950">
              <div className="grid gap-2 p-5 sm:grid-cols-2 sm:gap-6">
                <p className="text-sm font-medium leading-relaxed">{row.apa}</p>
                <p className="text-[13px] leading-relaxed text-muted">{row.cara}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.3rem,2.8vw,1.8rem)] font-semibold tracking-[-0.03em]">
              Menjalankan semua ujinya sendiri
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Perintah pertama hanya butuh Node dan selesai dalam hitungan detik.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-ink-900/50 p-5">
              <pre className="text-[13px] leading-relaxed text-muted">
                <code>{`git clone https://github.com/bryankwandou/fluentia
cd fluentia
npm install
npm test`}</code>
              </pre>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted/70">
              Hasilnya satu baris per uji dan satu jumlah di akhir. Baris merah
              berarti ada yang benar benar gagal, dan memang dimaksudkan untuk
              dibaca begitu.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.3rem,2.8vw,1.8rem)] font-semibold tracking-[-0.03em]">
              Yang belum ada di sini
            </h2>
            <ul className="mt-6 space-y-4">
              {BATASAN.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                  <span className="text-[15px] leading-relaxed text-muted">{item}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                <span className="text-[15px] leading-relaxed text-muted">
                  Dari {rows.length} jenjang, {tertulis} sudah punya unit
                  tertulis, seluruhnya {unit} unit. Sisanya diajar oleh tutor
                  berdasarkan deskripsi jenjangnya. Keduanya bisa dipakai, tetapi
                  bukan hal yang sama, jadi tidak dijumlahkan menjadi satu angka.{" "}
                  {LONG_TAIL.length} bahasa lain belum punya jenjang sama sekali.
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-16 border-t border-line pt-8 text-[15px] leading-relaxed text-muted">
            Kalau ada yang tidak sesuai, bagian yang gagal itulah yang paling
            berguna untuk dikirim balik. Laporan sesederhana &ldquo;alamat ini
            menjawab 404&rdquo; sudah cukup untuk ditindaklanjuti.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
