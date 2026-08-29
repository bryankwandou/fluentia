import type { Metadata } from "next";
import { Kids } from "@/views/kids";
import { KIDS } from "@/copy/pages";

export const metadata: Metadata = {
  title: KIDS.en.metaTitle,
  description: KIDS.en.metaDescription,
};

export default function Page() {
  return <Kids locale="en" />;
}
