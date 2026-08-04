import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { ENGLISH_MODULES, HSK_MODULES, slugifyModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Unit-level syllabus for HSK 1 through 6 and the English exam ladder up to TOEIC 900, with drill lines and the exam task each unit feeds.",
};

function Shelf({
  heading,
  blurb,
  modules,
}: {
  heading: string;
  blurb: string;
  modules: typeof HSK_MODULES;
}) {
  return (
    <section className="mt-16">
      <Reveal>
        <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{blurb}</p>
      </Reveal>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <StaggerItem key={module.code}>
            <Link href={`/modules/${slugifyModule(module.code)}`} className="block h-full">
              <article className="card card-hover flex h-full flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="rounded-md border border-jade-400/30 bg-jade-500/10 px-2 py-0.5 text-[11px] text-jade-300">
                    {module.code}
                  </span>
                  <span className="text-[11px] text-muted">{module.hours}h</span>
                </div>

                <h3 className="mt-3.5 text-base font-medium">{module.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                  {module.summary}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11px] text-muted">
                  <span>{module.units.length} units</span>
                  <span>{module.words.toLocaleString("en-US")} words</span>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export default function ModulesPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Modules</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            The actual work, unit by unit
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Each unit names the grammar it turns on, the vocabulary it introduces,
            drill lines you can record straight into the grader, and the exam
            task it exists to prepare you for. Mandarin drills carry numbered
            pinyin, which is what allows tone scoring to be measured from your
            pitch rather than guessed from a transcript.
          </p>
        </Reveal>

        <Shelf
          heading="Mandarin, HSK 1 to 6"
          blurb="The complete climb from first tones to the summary-writing task that decides most HSK 6 results."
          modules={HSK_MODULES}
        />

        <Shelf
          heading="English, repair work to TOEIC 900"
          blurb="Built for candidates who plateau in the 600s and cannot see why. The last two hundred points come from precision and stamina, not new vocabulary."
          modules={ENGLISH_MODULES}
        />
      </div>
    </div>
  );
}
