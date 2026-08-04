import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { STAGE_COPY, TRACKS, getTrack } from "@/lib/curriculum";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TRACKS.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return { title: "Track not found" };
  return {
    title: track.language,
    description: `Every rung of the ${track.language} ladder, from first sounds through ${track.levels.at(-1)?.code}, graded by speech.`,
  };
}

export default async function TrackPage({ params }: Params) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const totalHours = track.levels.reduce((sum, level) => sum + level.hours, 0);
  const topWords = track.levels.at(-1)?.words ?? 0;

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <Link href="/catalogue" className="text-sm text-muted hover:text-paper">
            ← Catalogue
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
              href={`/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(track.levels[0].code)}`}
              className="rounded-xl bg-jade-400 px-5 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Start this track
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
            {[
              [String(track.levels.length), "rungs on the ladder"],
              [`${totalHours}h`, "study hours end to end"],
              [topWords.toLocaleString("en-US"), "words at the summit"],
              [track.frameworks[0], "primary framework"],
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
            return (
              <StaggerItem key={level.code}>
                <article className="card card-hover p-6">
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
                        </div>
                        <p className="mt-1 text-sm text-paper/85">{level.title}</p>
                        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                          {level.can}. {stage.note}.
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-muted">
                      <p>{level.words.toLocaleString("en-US")} words</p>
                      <p className="mt-1">{level.hours}h of study</p>
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
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </div>
  );
}
