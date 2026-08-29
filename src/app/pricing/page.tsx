import type { Metadata } from "next";
import { Pricing } from "@/views/pricing";
import { PRICING } from "@/copy/proof";

export const metadata: Metadata = {
  title: PRICING.en.metaTitle,
  description: PRICING.en.metaDescription,
  alternates: { languages: { en: "/pricing", id: "/id/pricing" } },
};

export default function Page() {
  return <Pricing locale="en" />;
}
