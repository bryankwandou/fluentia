import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fluentia.vercel.app"),
  title: {
    default: "Fluentia: language study that leaves a record",
    template: "%s · Fluentia",
  },
  description:
    "An examiner-grade AI tutor for 200+ languages, from toddler sound play to HSK 6. Every passed level is written to Solana so the result can be checked by anyone.",
  keywords: [
    "language learning",
    "AI tutor",
    "HSK 6",
    "Mandarin",
    "speech grading",
    "Solana",
    "verifiable credentials",
  ],
  openGraph: {
    title: "Fluentia: language study that leaves a record",
    description:
      "Speak, get graded, and walk away with a credential anyone can verify on chain.",
    url: "https://fluentia.vercel.app",
    siteName: "Fluentia",
    type: "website",
  },
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
