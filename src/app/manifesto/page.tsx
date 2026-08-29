import type { Metadata } from "next";
import { Manifesto } from "@/views/manifesto";
import { MANIFESTO } from "@/copy/pages";

export const metadata: Metadata = {
  title: MANIFESTO.en.metaTitle,
  description: MANIFESTO.en.metaDescription,
};

export default function Page() {
  return <Manifesto locale="en" />;
}
