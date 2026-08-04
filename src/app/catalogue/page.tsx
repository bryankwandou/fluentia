import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Twelve fully mapped tracks with exam-board syllabi, plus open tutoring in more than two hundred further languages.",
};

export default function CataloguePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Catalogue</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            Twelve mapped ladders, and open tutoring in everything else
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            A mapped track carries the published syllabus for its exam board:
            word counts, study hours, and the specific things you should be able
            to do at each rung. Languages outside that set still work — the tutor
            grades them, they just have no certification ladder attached yet.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <StaggerItem key={track.slug}>
              <Link href={`/catalogue/${track.slug}`} className="block h-full">
                <article className="card card-hover flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-[family-name:var(--font-display)] text-3xl leading-none text-jade-300">
                      {track.native}
                    </p>
                    <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] tracking-widest text-muted/70">
                      {track.flagHint}
                    </span>
                  </div>

                  <h2 className="mt-4 text-base font-medium">{track.language}</h2>
                  <p className="mt-1 text-xs text-muted">
                    {track.family} · {track.learners}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {track.frameworks.map((framework) => (
                      <span
                        key={framework}
                        className="rounded-md border border-line px-2 py-1 text-[11px] text-muted"
                      >
                        {framework}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 border-t border-line pt-4 text-xs text-muted/80">
                    {track.levels.length} rungs · {track.levels.at(-1)?.code} at the top
                  </p>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-16 card p-7">
            <h2 className="text-lg font-medium">
              Also taught, without a certification ladder
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Open the tutor, type any of these, and it will hold a graded
              conversation. Mapped syllabi arrive for the most requested ones
              first.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {LONG_TAIL.map((language) => (
                <Link
                  key={language}
                  href={`/tutor?language=${encodeURIComponent(language)}`}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:border-jade-400/50 hover:text-paper"
                >
                  {language}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
