import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorConsole } from "@/components/tutor-console";

export const metadata: Metadata = {
  title: "Tutor",
  description:
    "Speak a line, get four separate scores back, and write the passing result to Solana devnet.",
};

export default function TutorPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="pill">Tutor</span>
            <h1 className="mt-4 text-[clamp(1.8rem,3.8vw,2.6rem)] font-semibold tracking-[-0.035em]">
              The examiner is listening
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Pick a language and a rung, ask for a line, then record yourself
              saying it. Accuracy, pronunciation, tone and fluency come back
              separately so you know which one is holding you back.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="card grid h-[560px] place-items-center text-sm text-muted">
              Loading the console…
            </div>
          }
        >
          <TutorConsole />
        </Suspense>
      </div>
    </div>
  );
}
