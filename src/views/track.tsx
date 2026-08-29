import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { TRACK } from "@/copy/catalogue";
import { STAGE_COPY, type Track as TrackData } from "@/lib/curriculum";
import { getModule, slugifyModule } from "@/lib/modules";
import { path, type Locale } from "@/lib/i18n";

export function Track({ locale, track }: { locale: Locale; track: TrackData }) {
  const copy = TRACK[locale];
  const totalHours = track.levels.reduce((sum, level) => sum + level.hours, 0);
  const topWords = track.levels.at(-1)?.words ?? 0;

  // The hours and the vocabulary above describe what the exam boards ask of a
  // candidate. They are not a description of what has been authored here, and
  // for a long time this page presented them as though they were: 240 hours
  // and five thousand words sitting over a rung holding thirty-six drill
  // lines. The counts below are the written material that actually exists, so
  // the two claims sit side by side and the reader can tell them apart.
  const authored = track.levels.reduce(
    (totals, level) => {
      const found = getModule(slugifyModule(level.code));
      if (found?.track !== track.slug) return totals;
      return {
        rungs: totals.rungs + 1,
        lines:
          totals.lines +
          found.units.reduce((sum, unit) => sum + unit.drills.length, 0),
      };
    },
    { rungs: 0, lines: 0 }
  );

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <Link
            href={path(locale, "/catalogue")}
            className="text-sm text-muted hover:text-paper"
          >
            ← {copy.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-[family-name:var(--font-display)] text-5xl leading-none text-jade-300">
                {track.native}
              </p>
              <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.035em]">
                {track.language}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {track.family} · {track.learners}
              </p>
            </div>

            <Link
              href={path(
                locale,
                `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(track.levels[0].code)}`
              )}
              className="btn btn-primary px-5 py-3 text-sm"
            >
              {copy.start}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
            {[
              [String(track.levels.length), copy.stats.rungs],
              [`${totalHours}h`, copy.stats.hours],
              [
                topWords.toLocaleString("en-US"),
                copy.stats.words(authored.rungs, track.levels.length),
              ],
              [
                authored.lines ? authored.lines.toLocaleString("en-US") : "0",
                authored.lines ? copy.stats.lines : copy.stats.noLines,
              ],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xl font-semibold tracking-tight">{value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Stagger className="mt-10 space-y-3">
          {track.levels.map((level, index) => {
            const stage = STAGE_COPY[level.stage];

            // A rung either has a written module behind it or it does not.
            // Where one exists the card opens it; where none does the card
            // opens the tutor already set to that language and level, which is
            // what actually teaches the rung. Nothing here is a dead card, and
            // the badge says which of the two the learner is about to get.
            const moduleSlug = slugifyModule(level.code);
            const found = getModule(moduleSlug);
            const written = found?.track === track.slug ? found : null;
            const href = written
              ? `/modules/${moduleSlug}`
              : `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(level.code)}`;

            return (
              <StaggerItem key={level.code}>
                <Link href={path(locale, href)} className="group block">
                  <article className="card card-hover p-6 transition-colors group-hover:border-jade-400/40">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 font-[family-name:var(--font-display)] text-2xl text-jade-300/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-medium">{level.code}</h2>
                            <span className="rounded-md border border-line px-2 py-0.5 text-[11px] text-muted">
                              {stage.label}
                            </span>
                            <span
                              className={
                                written
                                  ? "rounded-md border border-jade-400/40 bg-jade-500/10 px-2 py-0.5 text-[11px] text-jade-300"
                                  : "rounded-md border border-line px-2 py-0.5 text-[11px] text-muted/70"
                              }
                            >
                              {written
                                ? copy.written(written.units.length)
                                : copy.tutorLed}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-paper/85">{level.title}</p>
                          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                            {level.can}. {stage.note}.
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs text-muted">
                        {/* Target, not inventory. These two figures come from
                            the exam board and describe the rung a learner is
                            climbing toward; the line under them says what is
                            written here to climb it with. Printed bare, as they
                            were, a rung holding thirty-six drill lines
                            advertised five thousand words. */}
                        <p className="text-muted/60">{copy.target}</p>
                        <p className="mt-1">
                          {level.words.toLocaleString("en-US")} · {level.hours}h
                        </p>
                        <p className="mt-2 text-muted/60">
                          {written
                            ? copy.linesWritten(
                                written.units.reduce(
                                  (sum, unit) => sum + unit.drills.length,
                                  0
                                )
                              )
                            : copy.noLinesYet}
                        </p>
                        <p className="mt-2 text-jade-300/70 transition-colors group-hover:text-jade-300">
                          {written ? copy.openModule : copy.openTutor}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-jade-500 to-jade-300"
                        style={{
                          width: `${Math.round(((index + 1) / track.levels.length) * 100)}%`,
                        }}
                      />
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </div>
  );
}
