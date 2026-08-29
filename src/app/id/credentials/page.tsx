import type { Metadata } from "next";
import { Credentials } from "@/views/credentials";
import { CREDENTIALS } from "@/copy/proof";

export const metadata: Metadata = {
  title: CREDENTIALS.id.metaTitle,
  description: CREDENTIALS.id.metaDescription,
  alternates: { languages: { en: "/credentials", id: "/id/credentials" } },
};

export default function Page() {
  return <Credentials locale="id" />;
}
