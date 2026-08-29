import { Suspense } from "react";
import { TutorConsole } from "@/components/tutor-console";
import { TUTOR } from "@/copy/pages";
import type { Locale } from "@/lib/i18n";

export function Tutor({ locale }: { locale: Locale }) {
  const copy = TUTOR[locale];

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="pill">{copy.pill}</span>
            <h1 className="mt-4 text-[clamp(1.8rem,3.8vw,2.6rem)] font-semibold tracking-[-0.035em]">
              {copy.heading}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {copy.lead}
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="card grid h-[560px] place-items-center text-sm text-muted">
              {copy.loading}
            </div>
          }
        >
          {/* The console's own labels are still English. It is the largest
              component on the site and translating it half way would leave a
              screen that switches language mid-task, which reads worse than one
              that has not been touched yet. */}
          <TutorConsole />
        </Suspense>
      </div>
    </div>
  );
}
