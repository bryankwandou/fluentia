import { Suspense } from "react";
import Link from "next/link";
import { TutorConsole } from "@/components/tutor-console";
import { TUTOR } from "@/copy/pages";
import { path, type Locale } from "@/lib/i18n";

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
            {/* The syllabus is one click away in the top bar, but a reader who
                lands straight on the console never looks up there. Saying it
                here, beside the box that does the talking, is what separates
                this from a chat window with a microphone. */}
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted/80">
              {copy.sourceNote}{" "}
              <Link
                href={path(locale, "/modules")}
                className="text-jade-300 underline underline-offset-4 hover:text-jade-200"
              >
                {copy.sourceLink}
              </Link>
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
          {/* The locale reaches the console for two separate reasons: its own
              labels, and the language the model is told to explain in. Passing
              only the first would leave a screen that switches language the
              moment the tutor answers. */}
          <TutorConsole locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
