import type { Metadata } from "next";
import { Catalogue } from "@/views/catalogue";
import { CATALOGUE } from "@/copy/catalogue";

export const metadata: Metadata = {
  title: CATALOGUE.id.metaTitle,
  description: CATALOGUE.id.metaDescription,
  alternates: { languages: { en: "/catalogue", id: "/id/catalogue" } },
};

export default function Page() {
  return <Catalogue locale="id" />;
}
