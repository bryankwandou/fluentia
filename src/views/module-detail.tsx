import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { UnitQuiz } from "@/components/unit-quiz";
import { MODULE_DETAIL } from "@/copy/catalogue";
import { buildExercises } from "@/lib/exercises";
import type { Module } from "@/lib/modules";
import { path, type Locale } from "@/lib/i18n";

export function ModuleDetail({
  locale,
  module,
}: {
  locale: Locale;
  module: Module;
}) {
  const copy = MODULE_DETAIL[locale];

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-55" />

      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <Reveal>
          <Link
            href={path(locale, "/modules")}
            className="text-sm text-muted hover:text-paper"
          >
            ← {copy.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
            <div>
              <span className="rounded-md border border-jade-400/30 bg-jade-500/10 px-2.5 py-1 text-[12px] text-jade-300">
                {module.code}
              </span>
              <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.035em]">
                {module.title}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                {module.summary}
              </p>
            </div>

            <Link
              href={path(
                locale,
                `/tutor?level=${encodeURIComponent(module.code)}`
              )}
              className="btn btn-primary px-5 py-3 text-sm"
            >
              {copy.drill}
            </Link>
          </div>
        </Reveal>

        {/* Said out loud rather than left for the reader to work out. The
            syllabus below is authored in English; the drill lines are in the
            language being learned and are not translated on purpose. */}
        {copy.syllabusNote && (
          <Reveal delay={0.06}>
            <p className="mt-6 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-muted">
              {copy.syllabusNote}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.07}>
          <p className="mt-6 rounded-xl border border-jade-400/25 bg-jade-500/[0.04] px-4 py-3 text-[13px] leading-relaxed text-muted">
            {copy.practice}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-line py-6">
            {[
              [`${module.hours}h`, copy.hours],
              [module.words.toLocaleString("en-US"), copy.words],
              [String(module.units.length), copy.units],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xl font-semibold tracking-tight">{value}</dt>
                <dd className="mt-1 text-xs text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card mt-8 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted/70">
              {copy.exit}
            </p>
            <p className="mt-2.5 text-[15px] leading-relaxed">{module.exitCriteria}</p>
          </div>
        </Reveal>

        <Stagger className="mt-10 space-y-4">
          {module.units.map((unit, index) => (
            <StaggerItem key={unit.id}>
              <article className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 font-[family-name:var(--font-display)] text-2xl text-jade-300/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-medium">{unit.title}</h2>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                      {unit.focus}
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted/70">
                          {copy.grammar}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {unit.grammar.map((point) => (
                            <li key={point} className="flex gap-2 text-[13px] text-muted">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted/70">
                          {copy.vocabulary}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {unit.vocabulary.map((word) => (
                            <span
                              key={word}
                              className="rounded-md border border-line px-2 py-1 text-[12.5px] text-muted"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted/70">
                        {copy.drills}
                      </p>
                      <div className="mt-2 space-y-2">
                        {unit.drills.map((drill) => (
                          <div
                            key={drill.target}
                            className="rounded-lg border border-line bg-white/[0.02] px-3 py-2.5"
                          >
                            <p className="text-[15px]">{drill.target}</p>
                            {drill.roman && (
                              <p className="mt-0.5 text-[12.5px] text-jade-300/80">
                                {drill.roman}
                              </p>
                            )}
                            <p className="mt-0.5 text-[12.5px] text-muted">{drill.gloss}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="mt-5 border-t border-line pt-4 text-[12.5px] text-muted">
                      {copy.feeds}: {unit.examTask}
                    </p>

                    {/* Built on the server from the drills printed above, so
                        the questions and the syllabus cannot drift apart. */}
                    <UnitQuiz
                      locale={locale}
                      track={module.track}
                      level={module.code}
                      exercises={buildExercises(unit, module)}
                    />
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
