import type { Metadata } from "next";
import { Tutor } from "@/views/tutor";
import { TUTOR } from "@/copy/pages";

export const metadata: Metadata = {
  title: TUTOR.en.metaTitle,
  description: TUTOR.en.metaDescription,
};

export default function Page() {
  return <Tutor locale="en" />;
}
