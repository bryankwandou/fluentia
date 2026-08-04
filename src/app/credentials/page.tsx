import type { Metadata } from "next";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { VerifyPanel } from "@/components/verify-panel";

export const metadata: Metadata = {
  title: "Credentials",
  description:
    "How Fluentia writes a passed level to Solana, what goes on chain, and how to check a signature yourself.",
};

const ANATOMY = [
  { field: "Learner wallet", body: "The address that earned it. Nothing else identifies you: no name, no email, no audio." },
  { field: "Language and level", body: "Which ladder and which rung, written as the exam board writes it." },
  { field: "Score", body: "The composite mark out of one hundred. Sixty is the floor for issuing anything." },
  { field: "Attempt fingerprint", body: "A hash of the graded transcript. It proves a specific attempt without publishing what you said." },
  { field: "Timestamp", body: "When the level was cleared, so an old result can be read as an old result." },
];

const OBJECTIONS = [
  {
    q: "Could someone forge one?",
    a: "The transaction has to be signed by the registrar key. A memo written by any other wallet reads as unsigned and the verifier rejects it.",
  },
  {
    q: "What if Fluentia disappears?",
    a: "The record stays on Solana and the format is documented in the repository. Reading it needs a public RPC endpoint and nothing else.",
  },
  {
    q: "Is my voice stored anywhere?",
    a: "The recording is sent to the grader, scored, and dropped. What survives is the transcript hash, which cannot be turned back into audio.",
  },
  {
    q: "Why devnet and not mainnet?",
    a: "This build runs on devnet so the flow can be exercised without real money. The instruction set is unchanged on mainnet; only the cluster endpoint moves.",
  },
];

export default function CredentialsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Credentials</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            The part of your progress that does not depend on us
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Passing a level produces a small public record signed by our
            registrar and addressed to your wallet. It is short by design: enough
            to confirm the claim, not enough to profile you.
          </p>
        </Reveal>

        <div id="verify" className="mt-12 scroll-mt-24">
          <Reveal>
            <VerifyPanel />
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-20 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[-0.03em]">
            What actually goes on chain
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {ANATOMY.map((row) => (
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
            The obvious objections
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
          {OBJECTIONS.map((item) => (
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
