import type { Metadata } from "next";
import { Home } from "@/views/home";

export const metadata: Metadata = {
  title: "Fluentia: belajar bahasa yang meninggalkan catatan",
  description:
    "Tutor bicara yang menilai seperti penguji sungguhan untuk 200+ bahasa, dari bermain bunyi bersama balita sampai HSK 6. Setiap jenjang yang lulus ditulis ke Solana supaya hasilnya bisa diperiksa siapa pun.",
  alternates: { canonical: "/id", languages: { en: "/", id: "/id" } },
};

export default function BerandaPage() {
  return <Home locale="id" />;
}
