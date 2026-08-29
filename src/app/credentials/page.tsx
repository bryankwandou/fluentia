import type { Metadata } from "next";
import { Credentials } from "@/views/credentials";
import { CREDENTIALS } from "@/copy/proof";

export const metadata: Metadata = {
  title: CREDENTIALS.en.metaTitle,
  description: CREDENTIALS.en.metaDescription,
  alternates: { languages: { en: "/credentials", id: "/id/credentials" } },
};

export default function Page() {
  return <Credentials locale="en" />;
}
