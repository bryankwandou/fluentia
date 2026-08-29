import type { Metadata } from "next";
import { Modules } from "@/views/modules";
import { MODULES } from "@/copy/catalogue";

export const metadata: Metadata = {
  title: MODULES.en.metaTitle,
  description: MODULES.en.metaDescription,
  alternates: { languages: { en: "/modules", id: "/id/modules" } },
};

export default function Page() {
  return <Modules locale="en" />;
}
