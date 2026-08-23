import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Why we built this",
  description:
    "The argument behind Fluentia: soft grading wastes years, and a certificate nobody can check is worth very little.",
};

export default function ManifestoPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <Reveal>
          <span className="pill">Position</span>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            Two habits that keep learners stuck
          </h1>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 space-y-6 text-[16px] leading-[1.75] text-muted">
            <p>
              The first is soft grading. An app that congratulates a mangled
              sentence is pleasant to use and expensive to trust. Learners spend
              months collecting green marks and then freeze the first time a
              native speaker answers at normal speed. The feedback was never
              honest enough to be useful.
            </p>
            <p>
              We took the other route. Every recording is scored on four separate
              axes, and a poor attempt is told it was poor, along with the one
              correction most worth making. It is less comfortable. It is also
              the only version that shortens the road.
            </p>

            <div className="hairline my-10" />

            <p>
              The second habit is the disposable certificate. Course platforms
              hand out a PDF whose only guarantee is that the company issuing it
              still exists. Schools fold, apps shut down, and years of study
              become a claim on a résumé that nobody can confirm.
            </p>
            <p>
              So we publish the result instead of storing it. When you clear a
              level, the language, the rung, the score and a hash of the graded
              attempt are written to Solana under your wallet. Reading it back
              takes a signature and a public endpoint. It works whether or not we
              are still here, which is the entire point.
            </p>

            <div className="hairline my-10" />

            <p>
              Everything else follows from those two decisions. Pricing runs per
              finished lesson because we would rather be paid for work done than
              for a forgotten renewal. The children's track drops streaks and
              leaderboards because we are not willing to sell attention capture
              to parents as education. The catalogue climbs to HSK 6 and CEFR C2
              because stopping at holiday phrases is where the market already is,
              and it is not where people actually need help.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href="/tutor"
              className="btn btn-primary px-5 py-3 text-sm"
            >
              Test the grading yourself
            </Link>
            <Link
              href="https://github.com/VincentiusBryanKwandou/fluentia"
              className="btn btn-ghost px-5 py-3 text-sm"
            >
              Read the source
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
