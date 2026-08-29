import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { PRICING as COPY } from "@/copy/proof";
import { PRICING } from "@/lib/curriculum";
import { path, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Pricing({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

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

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {PRICING.map((plan) => {
            // Prices and which card is highlighted stay in the data; every word
            // on the card comes from the dictionary, keyed by the plan's name
            // in that data. A plan added there without wording here shows its
            // own key, which is ugly enough to get noticed and fixed.
            const words = copy.plans[plan.name];
            return (
            <StaggerItem key={plan.name}>
              <article
                className={cn(
                  "card flex h-full flex-col p-7",
                  plan.highlight && "border-jade-400/40 bg-jade-500/[0.06]"
                )}
              >
                {plan.highlight && (
                  <span className="mb-4 self-start rounded-full bg-jade-400 px-2.5 py-1 text-[11px] font-medium text-ink-950">
                    {copy.highlight}
                  </span>
                )}

                <h2 className="text-base font-medium">{words?.name ?? plan.name}</h2>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">
                    {plan.price === 0 ? copy.free : plan.price}
                  </span>
                  {words?.unit && (
                    <span className="text-xs text-muted">{words.unit}</span>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {words?.tagline ?? plan.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {(words?.features ?? plan.features).map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={path(locale, "/tutor")}
                  className={cn(
                    "btn mt-7 px-4 py-3 text-center text-sm",
                    plan.highlight ? "btn-primary" : "btn-ghost"
                  )}
                >
                  {words?.cta ?? plan.cta}
                </Link>
              </article>
            </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal>
          <div className="mt-16 card p-7">
            <h2 className="text-lg font-medium">{copy.settlementHeading}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {copy.settlement.map(([step, body], index) => (
                <div key={step}>
                  <span className="font-[family-name:var(--font-display)] text-2xl text-jade-300">
                    0{index + 1}
                  </span>
                  <h3 className="mt-1.5 text-sm font-medium">{step}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mt-20 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            {copy.notesHeading}
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
          {copy.notes.map((note) => (
            <StaggerItem key={note.q}>
              <article className="card card-hover h-full p-6">
                <h3 className="text-base font-medium">{note.q}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{note.a}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
