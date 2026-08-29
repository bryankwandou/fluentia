import Link from "next/link";
import { ToneLab } from "@/components/tone-lab";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { HOME } from "@/copy/home";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { path, type Locale } from "@/lib/i18n";

/**
 * The landing page, with its words held somewhere else.
 *
 * Both locales render this file, so a section added here appears in each of
 * them or in neither. The alternative, one page per language, drifts the first
 * time somebody edits only the one they happen to read.
 */
export function Home({ locale }: { locale: Locale }) {
  const copy = HOME[locale];
  const to = (target: string) => path(locale, target);
  const featured = TRACKS.filter((track) => track.featured);
  const marquee = [...TRACKS.map((track) => track.language), ...LONG_TAIL];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="aurora" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <span className="pill">
                  <span className="h-1.5 w-1.5 rounded-full bg-jade-400" />
                  {copy.badge}
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                  {copy.titleTop}
                  <br />
                  <span className="font-[family-name:var(--font-display)] font-normal italic text-jade-300">
                    {copy.titleAccent}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
                  {copy.lead}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href={to("/tutor")} className="btn btn-primary px-5 py-3 text-sm">
                    {copy.ctaPrimary}
                  </Link>
                  <Link href={to("/catalogue")} className="btn btn-ghost px-5 py-3 text-sm">
                    {copy.ctaSecondary}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                  {copy.stats.map(([value, label]) => (
                    <div key={label}>
                      <dt className="text-2xl font-semibold tracking-tight">{value}</dt>
                      <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.2} y={28}>
              <ToneLab locale={locale} />
            </Reveal>
          </div>
        </div>

        <div className="relative border-y border-line py-4">
          <div className="marquee-track gap-8 whitespace-nowrap px-4">
            {[...marquee, ...marquee].map((language, index) => (
              <span key={`${language}-${index}`} className="text-sm text-muted/50">
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- pillars */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <h2 className="max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
            {copy.pillarsHeading}
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
          {copy.pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <article className="card card-hover h-full p-7">
                <span className="text-[11px] uppercase tracking-[0.16em] text-jade-300/80">
                  {pillar.tag}
                </span>
                <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------------------------------------------------------- ladder */}
      <section className="relative border-y border-line bg-ink-900/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
              {copy.ladderEyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
              {copy.ladderHeading}
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-5">
            {copy.ladder.map((rung) => (
              <StaggerItem key={rung.label} className="bg-ink-950">
                <div className="h-full p-6">
                  <span className="text-xs text-amber">{rung.age}</span>
                  <h3 className="mt-2 text-base font-medium">{rung.label}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{rung.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* -------------------------------------------------------- featured */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold tracking-[-0.03em]">
              {copy.featuredHeading}
            </h2>
            <Link href={to("/catalogue")} className="text-sm text-jade-300 hover:text-jade-400">
              {copy.featuredMore}
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((track) => (
            <StaggerItem key={track.slug}>
              <Link href={to(`/catalogue/${track.slug}`)} className="block h-full">
                <article className="card card-hover h-full p-6">
                  <p className="font-[family-name:var(--font-display)] text-3xl leading-none text-jade-300">
                    {track.native}
                  </p>
                  <h3 className="mt-4 text-base font-medium">{track.language}</h3>
                  <p className="mt-1 text-xs text-muted">{track.learners}</p>
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
                </article>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ----------------------------------------------------------- steps */}
      <section className="relative overflow-hidden border-y border-line bg-ink-900/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <h2 className="max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
              {copy.stepsHeading}
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((step) => (
              <StaggerItem key={step.n}>
                <div className="relative pt-6">
                  <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-jade-500/60 to-transparent" />
                  <span className="font-[family-name:var(--font-display)] text-2xl text-jade-300">
                    {step.n}
                  </span>
                  <h3 className="mt-2 text-base font-medium">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{step.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ----------------------------------------------------------- proof */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.16em] text-muted/70">
              {copy.proofEyebrow}
            </p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
              {copy.proofHeading}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
              {copy.proofBody.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <Link
              href={to("/credentials")}
              className="btn btn-ghost mt-7 inline-flex px-5 py-3 text-sm"
            >
              {copy.proofCta}
            </Link>
          </Reveal>

          <Reveal delay={0.1} y={26}>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-jade-400/70" />
                <span className="ml-2 text-xs text-muted">{copy.memoLabel}</span>
              </div>
              <pre className="overflow-x-auto p-5 text-[12.5px] leading-relaxed text-jade-300/90">
{`{
  "p": "fluentia.v1",
  "l": "5JTDJdfD…KWFfSk",
  "t": "Mandarin Chinese",
  "v": "HSK 4",
  "s": 88.5,
  "h": "9f2c41ae…",
  "d": "2026-08-04T09:12:07Z"
}`}
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="aurora opacity-70" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
          <Reveal>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.035em]">
              {copy.closingHeading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
              {copy.closingBody}
            </p>
            <Link
              href={to("/tutor")}
              className="btn btn-primary mt-9 inline-flex px-6 py-3.5 text-sm"
            >
              {copy.closingCta}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
