import type { Metadata } from "next";
import { Coverage } from "@/views/coverage";
import { COVERAGE } from "@/copy/proof";

export const metadata: Metadata = {
  title: COVERAGE.id.metaTitle,
  description: COVERAGE.id.metaDescription,
  alternates: { languages: { en: "/coverage", id: "/id/coverage" } },
};

export default function Page() {
  return <Coverage locale="id" />;
}
