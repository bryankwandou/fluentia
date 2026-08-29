import type { Metadata } from "next";
import { Audit } from "@/views/audit";
import { AUDIT } from "@/copy/proof";

export const metadata: Metadata = {
  title: AUDIT.id.metaTitle,
  description: AUDIT.id.metaDescription,
  alternates: { languages: { en: "/audit", id: "/id/audit" } },
};

export default function Page() {
  return <Audit locale="id" />;
}
