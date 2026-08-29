import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { VerifyPanel } from "@/components/verify-panel";
import { CREDENTIALS } from "@/copy/proof";
import type { Locale } from "@/lib/i18n";

export function Credentials({ locale }: { locale: Locale }) {
  const copy = CREDENTIALS[locale];

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

        <div id="verify" className="mt-12 scroll-mt-24">
          <Reveal>
            <VerifyPanel />
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-20 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            {copy.anatomyHeading}
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {copy.anatomy.map((row) => (
            <StaggerItem key={row.field} className="bg-ink-950">
              <div className="flex flex-col gap-1.5 p-5 sm:flex-row sm:gap-8">
                <p className="w-56 shrink-0 text-sm font-medium">{row.field}</p>
                <p className="text-sm leading-relaxed text-muted">{row.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <h2 className="mt-20 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            {copy.objectionsHeading}
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
          {copy.objections.map((item) => (
            <StaggerItem key={item.q}>
              <article className="card card-hover h-full p-6">
                <h3 className="text-base font-medium">{item.q}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.a}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
