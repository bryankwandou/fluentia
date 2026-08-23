import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { PRICING } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Pay per finished lesson in USDC, or take a monthly seat. No subscription that quietly bills you through a month you did not study.",
};

const NOTES = [
  {
    q: "Why not a normal monthly subscription?",
    a: "Because most of that revenue comes from people who stopped studying in week two and forgot to cancel. Charging by finished lesson means we only earn when the product was used.",
  },
  {
    q: "What is a lesson, exactly?",
    a: "One graded speaking round plus the tutor turns around it. If the grader fails or returns nothing usable, the round is not charged.",
  },
  {
    q: "Can I get my balance back?",
    a: "Yes. Unspent USDC sits in your own balance and withdraws to the wallet that funded it. We do not hold it hostage behind a support ticket.",
  },
  {
    q: "Is this real money right now?",
    a: "No. Everything here settles in devnet USDC, which has no value. The instruction flow is what a mainnet build would use, but nothing is charged.",
  },
];

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Pricing</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            You pay for lessons you finished, not months you meant to use
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Settlement runs in USDC on Solana devnet, which makes a quarter-dollar
            charge economical in a way a card network never has been.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 lg:grid-cols-3">
          {PRICING.map((plan) => (
            <StaggerItem key={plan.name}>
              <article
                className={cn(
                  "card flex h-full flex-col p-7",
                  plan.highlight && "border-jade-400/40 bg-jade-500/[0.06]"
                )}
              >
                {plan.highlight && (
                  <span className="mb-4 self-start rounded-full bg-jade-400 px-2.5 py-1 text-[11px] font-medium text-ink-950">
                    What most people pick
                  </span>
                )}

                <h2 className="text-base font-medium">{plan.name}</h2>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">
                    {plan.price === 0 ? "Free" : plan.price}
                  </span>
                  {plan.unit && (
                    <span className="text-xs text-muted">{plan.unit}</span>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {plan.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-muted">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/tutor"
                  className={cn(
                    "btn mt-7 px-4 py-3 text-center text-sm",
                    plan.highlight ? "btn-primary" : "btn-ghost"
                  )}
                >
                  {plan.cta}
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-16 card p-7">
            <h2 className="text-lg font-medium">How settlement works</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                ["Fund", "You transfer devnet USDC into a balance keyed to your wallet."],
                ["Draw", "Each completed lesson debits the agreed amount from that balance."],
                ["Withdraw", "Whatever is left returns to the funding wallet on request."],
              ].map(([step, body], index) => (
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
            Questions worth asking before you pay anything
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
          {NOTES.map((note) => (
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
