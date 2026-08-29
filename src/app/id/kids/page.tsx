import type { Metadata } from "next";
import { Kids } from "@/views/kids";
import { KIDS } from "@/copy/pages";

export const metadata: Metadata = {
  title: KIDS.id.metaTitle,
  description: KIDS.id.metaDescription,
  alternates: { languages: { en: "/kids", id: "/id/kids" } },
};

export default function Page() {
  return <Kids locale="id" />;
}
