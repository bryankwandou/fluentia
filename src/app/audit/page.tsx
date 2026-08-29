import type { Metadata } from "next";
import { Audit } from "@/views/audit";
import { AUDIT } from "@/copy/proof";

export const metadata: Metadata = {
  title: AUDIT.en.metaTitle,
  description: AUDIT.en.metaDescription,
  alternates: { languages: { en: "/audit", id: "/id/audit" } },
};

export default function Page() {
  return <Audit locale="en" />;
}
