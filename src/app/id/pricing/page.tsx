import type { Metadata } from "next";
import { Pricing } from "@/views/pricing";
import { PRICING } from "@/copy/proof";

export const metadata: Metadata = {
  title: PRICING.id.metaTitle,
  description: PRICING.id.metaDescription,
  alternates: { languages: { en: "/pricing", id: "/id/pricing" } },
};

export default function Page() {
  return <Pricing locale="id" />;
}
