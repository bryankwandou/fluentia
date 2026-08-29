import type { Metadata } from "next";
import { Coverage } from "@/views/coverage";
import { COVERAGE } from "@/copy/proof";

export const metadata: Metadata = {
  title: COVERAGE.en.metaTitle,
  description: COVERAGE.en.metaDescription,
  alternates: { languages: { en: "/coverage", id: "/id/coverage" } },
};

export default function Page() {
  return <Coverage locale="en" />;
}
