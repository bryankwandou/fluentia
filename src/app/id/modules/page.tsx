import type { Metadata } from "next";
import { Modules } from "@/views/modules";
import { MODULES } from "@/copy/catalogue";

export const metadata: Metadata = {
  title: MODULES.id.metaTitle,
  description: MODULES.id.metaDescription,
  alternates: { languages: { en: "/modules", id: "/id/modules" } },
};

export default function Page() {
  return <Modules locale="id" />;
}
