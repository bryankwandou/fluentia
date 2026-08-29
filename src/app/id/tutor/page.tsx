import type { Metadata } from "next";
import { Tutor } from "@/views/tutor";
import { TUTOR } from "@/copy/pages";

export const metadata: Metadata = {
  title: TUTOR.id.metaTitle,
  description: TUTOR.id.metaDescription,
  alternates: { languages: { en: "/tutor", id: "/id/tutor" } },
};

export default function Page() {
  return <Tutor locale="id" />;
}
