import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { MODULES } from "@/copy/catalogue";
import { countExercises } from "@/lib/exercises";
import { ENGLISH_MODULES, HSK_MODULES, slugifyModule } from "@/lib/modules";
import { path, type Locale } from "@/lib/i18n";

function Shelf({
  locale,
  heading,
  blurb,
  modules,
}: {
  locale: Locale;
  heading: string;
  blurb: string;
  modules: typeof HSK_MODULES;
}) {
  const copy = MODULES[locale];

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
            <Link
              href={path(locale, `/modules/${slugifyModule(module.code)}`)}
              className="block h-full"
            >
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
                  <span>
                    {module.units.length} {copy.units}
                  </span>
                  <span>
                    {module.words.toLocaleString("en-US")} {copy.words}
                  </span>
                  <span className="text-jade-300/80">
                    {countExercises(module)} {copy.questions}
                  </span>
                </div>
              </article>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function Modules({ locale }: { locale: Locale }) {
  const copy = MODULES[locale];

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">{copy.pill}</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            {copy.lead}
          </p>
        </Reveal>

        <Shelf
          locale={locale}
          heading={copy.mandarinHeading}
          blurb={copy.mandarinBlurb}
          modules={HSK_MODULES}
        />

        <Shelf
          locale={locale}
          heading={copy.englishHeading}
          blurb={copy.englishBlurb}
          modules={ENGLISH_MODULES}
        />
      </div>
    </div>
  );
}
