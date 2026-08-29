import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { KIDS } from "@/copy/pages";
import { path, type Locale } from "@/lib/i18n";

export function Kids({ locale }: { locale: Locale }) {
  const copy = KIDS[locale];

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">{copy.pill}</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            {copy.lead}
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {copy.principles.map((principle) => (
            <StaggerItem key={principle.title}>
              <article className="card card-hover h-full p-6">
                <h2 className="text-base font-medium">{principle.title}</h2>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                  {principle.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <h2 className="mt-20 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            {copy.routeHeading}
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {copy.route.map((rung) => (
            <StaggerItem key={rung.code} className="bg-ink-950">
              <div className="h-full p-6">
                <span className="text-xs text-amber">{rung.code}</span>
                <h3 className="mt-2 text-base font-medium">{rung.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{rung.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Link
              href={path(locale, "/tutor?level=K0")}
              className="btn btn-primary px-5 py-3 text-sm"
            >
              {copy.ctaPrimary}
            </Link>
            <Link
              href={path(locale, "/catalogue")}
              className="btn btn-ghost px-5 py-3 text-sm"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
