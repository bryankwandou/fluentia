import type { Metadata } from "next";
import { Manifesto } from "@/views/manifesto";
import { MANIFESTO } from "@/copy/pages";

export const metadata: Metadata = {
  title: MANIFESTO.id.metaTitle,
  description: MANIFESTO.id.metaDescription,
  alternates: { languages: { en: "/manifesto", id: "/id/manifesto" } },
};

export default function Page() {
  return <Manifesto locale="id" />;
}
