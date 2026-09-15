import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { RUNG } from "@/copy/rung";
import { STAGE_COPY, type Level, type Track } from "@/lib/curriculum";
import { path, type Locale } from "@/lib/i18n";
import { rungHref, tutorHref, writtenModule } from "@/lib/routes";

/**
 * The page behind a rung that has no written module. It is free, it does not
 * call a model, and it says plainly that the shelf is empty. The tutor sits at
 * the bottom under its own heading so nobody arrives there by accident.
 */
export function Rung({
  locale,
  track,
  level,
}: {
  locale: Locale;
  track: Track;
  level: Level;
}) {
  const copy = RUNG[locale];
  const stage = STAGE_COPY[level.stage];

  const written = track.levels
    .map((entry) => ({ entry, module: writtenModule(track, entry) }))
    .filter((row) => row.module);

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <Reveal>
          <Link
            href={path(locale, `/catalogue/${track.slug}`)}
            className="text-sm text-muted hover:text-paper"
          >
            ← {copy.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-line px-2.5 py-1 text-[12px] text-muted">
              {track.language} · {level.code}
            </span>
            <span className="rounded-md border border-line px-2 py-0.5 text-[11px] text-muted/70">
              {copy.unwritten}
            </span>
          </div>

          <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.035em]">
            {level.title}
          </h1>
          <p className="mt-2 text-sm text-muted">{stage.label}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="card mt-8 p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted/70">
              {copy.can}
            </p>
            <p className="mt-2.5 text-[15px] leading-relaxed">
              {level.can}. {stage.note}.
            </p>
            <p className="mt-4 border-t border-line pt-4 text-[12.5px] text-muted">
              {copy.target}: {level.words.toLocaleString("en-US")} {copy.words} ·{" "}
              {level.hours} {copy.hours}
            </p>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            {copy.nothingYet}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted/70">
              {copy.nearest}
            </p>
            {written.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {written.map(({ entry }) => (
                  <Link
                    key={entry.code}
                    href={path(locale, rungHref(track, entry))}
                    className="btn btn-primary px-4 py-2.5 text-sm"
                  >
                    {copy.openModule(entry.code)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[13.5px] text-muted">
                {copy.noneOnTrack}{" "}
                <Link
                  href={path(locale, "/modules")}
                  className="text-jade-300 underline underline-offset-4"
                >
                  /modules
                </Link>
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-14 border-t border-line pt-6">
            <h2 className="text-sm font-medium">{copy.tutorHeading}</h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              {copy.tutorBody}
            </p>
            <Link
              href={path(locale, tutorHref(track.language, level.code))}
              className="mt-3 inline-block text-[13px] text-muted underline underline-offset-4 hover:text-paper"
            >
              {copy.tutorLink}
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
