import type { Metadata } from "next";
import Link from "next/link";
import { LinkAudit } from "@/components/link-audit";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Audit",
  description:
    "How to check the claims on this site without taking any of them on trust: a live link audit, the test suites, and what each one would look like if it failed.",
};

/**
 * Each claim paired with the thing that would show it up.
 *
 * A claim nobody can disprove is not evidence, so the third column is the one
 * that matters: it says what a reader would see if the sentence in the first
 * column were false. Two of these have already fired and caught real faults.
 */
const CLAIMS = [
  {
    claim: "Every module and every rung opens a real page.",
    check: "The audit above, run in your browser. Also `links-proof`, which rebuilds the same address list from the repository and asks the deployment for each one.",
    fails: "The failing address is printed with its status code. The suite exits non-zero.",
  },
  {
    claim: "Tone scoring measures pitch, and can tell tones apart.",
    check: "`tone-proof`, `cantonese-proof`, `vietnamese-proof`. Each synthesises an utterance with known tones, scores it, then mislabels it and requires the score to drop.",
    fails: "A mislabelled utterance scores as well as a correct one, which would mean the grader is reading the transcript and not the pitch.",
  },
  {
    claim: "Review scheduling follows SM-2, not a streak counter.",
    check: "`srs-proof`, twenty-two assertions on the interval ladder, the ease floor, and what a lapse does. `deck-proof` runs thirty simulated days.",
    fails: "An interval that grows when it should reset, or an ease that rises on an imperfect answer.",
  },
  {
    claim: "The written syllabus can actually be graded.",
    check: "`content-proof` walks every authored unit and requires each drill line to carry the numbered pinyin the tone grader needs.",
    fails: "A unit that reads well on the page but cannot be scored, which is the failure mode worth catching.",
  },
  {
    claim: "Payment arithmetic is correct and a transaction cannot be replayed.",
    check: "`settle-proof` offline, `replay-proof` against Solana devnet with a real signature submitted twice.",
    fails: "A second submission of the same signature is accepted, or a balance that does not reconcile.",
  },
  {
    claim: "The address you are reading is the code on GitHub.",
    check: "`deployed-proof` asks /api/build for the commit and compares it with the repository.",
    fails: "The URL reports a commit nobody can produce. This one has fired: an alias had drifted and a suite spent a run auditing code that was never shipped here.",
  },
  {
    claim: "The speaking pipeline works end to end, not just in tests.",
    check: "`speech-proof` sends real audio to the live deployment and requires a transcript and a score back.",
    fails: "A provider outage or a retired model. This one has fired too.",
  },
];

const LIMITS = [
  "Settlement runs on Solana devnet. The balances are test funds and no money changes hands. The instruction flow is what a mainnet build would use, but calling it revenue would be false.",
  "Progress is kept in your browser, not on a server. Clearing site data clears it. There are no accounts.",
  "Recordings are graded and dropped. What survives an attempt is a hash of the transcript, which cannot be turned back into audio.",
];

export default function AuditPage() {
  const rows = TRACKS.flatMap((track) =>
    track.levels.map((level) => {
      const slug = slugifyModule(level.code);
      const found = getModule(slug);
      return { written: found?.track === track.slug ? found : null };
    })
  );
  const writtenRows = rows.filter((row) => row.written);
  const units = ALL_MODULES.reduce((sum, module) => sum + module.units.length, 0);

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Audit</span>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            Checking this without taking our word for it
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Everything below can be verified by someone who does not trust the
            people who built it. The check at the top runs by itself when this
            page opens. The rest can be run from a clone in about two minutes.
          </p>
        </Reveal>

        <div className="mt-10">
          <Reveal>
            <LinkAudit />
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              About the report that the modules would not open
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              That was worth reporting and the check above exists because of it.
              Two things had gone wrong. The catalogue offered rungs that had no
              page behind them, so a card that looked interactive did nothing.
              Separately, the address being read was not always the address the
              latest work had been deployed to, so a fix could be live somewhere
              and absent here at the same time.
            </p>
            <p className="mt-3.5 text-[15px] leading-relaxed text-muted">
              Both are closed now, and neither is closed by assertion. Every rung
              resolves either to an authored module or to the tutor opened at
              that level, and the audit above walks all of them from your machine.
              The deployment says which commit it is running at{" "}
              <Link href="/api/build" className="text-jade-300 underline underline-offset-4">
                /api/build
              </Link>
              , and a deploy that cannot move the canonical address now fails
              rather than reporting success.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              What is claimed, and what would disprove it
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              The third column is the one that matters. A claim that nothing
              could contradict is not evidence of anything. Two of these have
              caught real faults, and both are noted as such.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {CLAIMS.map((row) => (
            <StaggerItem key={row.claim} className="bg-ink-950">
              <div className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr] sm:gap-6 sm:p-6">
                <p className="text-sm font-medium leading-relaxed">{row.claim}</p>
                <div>
                  <p className="text-[13px] leading-relaxed text-muted">{row.check}</p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted/70">
                    <span className="text-muted">If it were false: </span>
                    {row.fails}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              Running all of it yourself
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              The first command needs nothing but Node. It runs the seven suites
              that do not touch the network and finishes in a few seconds.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-ink-900/50 p-5">
          <pre className="text-[13px] leading-relaxed text-muted">
            <code>{`git clone https://github.com/bryankwandou/fluentia
cd fluentia
npm install
npm test        # seven suites, offline
npm run test:all # adds devnet and live-deployment suites`}</code>
          </pre>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-muted/70">
          The last command needs API credentials in <code>.env.local</code> and a
          devnet connection, because those suites are about a live system rather
          than about the source. It prints one line per suite and a count at the
          end. Anything red is a real failure and is meant to be read as one.
        </p>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              What this does not do
            </h2>
            <ul className="mt-6 space-y-4">
              {LIMITS.map((limit) => (
                <li key={limit} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                  <span className="text-[15px] leading-relaxed text-muted">{limit}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                <span className="text-[15px] leading-relaxed text-muted">
                  {writtenRows.length} of {rows.length} rungs carry authored
                  units, {units} of them in total. The rest are taught by the
                  tutor from the level descriptor. Both work; they are not the
                  same thing, and{" "}
                  <Link href="/coverage" className="text-jade-300 underline underline-offset-4">
                    the coverage table
                  </Link>{" "}
                  marks which is which rather than counting them together. The{" "}
                  {LONG_TAIL.length} long-tail languages have no ladder at all.
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 border-t border-line pt-8">
            <p className="text-[15px] leading-relaxed text-muted">
              If something here does not hold up, the failing case is the useful
              thing to send back. The suites are written so that a fault names
              itself, and a report of the shape &ldquo;this address returned
              404&rdquo; is enough to act on.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
