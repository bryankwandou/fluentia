import Link from "next/link";
import { ToneLab } from "@/components/tone-lab";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";

const PILLARS = [
  {
    tag: "Grading",
    title: "It listens, then it marks you down",
    body: "Recordings pass through Whisper, then an examiner model scores accuracy, pronunciation, tone and fluency as four separate numbers. A weak attempt gets a weak score. Nothing is rounded up to keep you comfortable.",
  },
  {
    tag: "Curriculum",
    title: "The ladder does not stop at tourist phrases",
    body: "Mandarin runs the full HSK 1 to 6 climb alongside YCT for children. Other tracks map onto CEFR A1 to C2, JLPT and TOPIK. The syllabus follows what the exam boards actually publish.",
  },
  {
    tag: "Proof",
    title: "A result you keep after you cancel",
    body: "Clear a level and the score, the level and a fingerprint of the graded attempt are written to Solana under your wallet. The record outlives our servers.",
  },
  {
    tag: "Money",
    title: "Pay for the lesson, not the calendar",
    body: "Fund a small USDC balance and each finished lesson draws from it. Stop for three months and you owe nothing. Whatever is left withdraws on request.",
  },
];

const LADDER = [
  { age: "3-6", label: "Sound play", body: "Songs and picture prompts. No reading, no keyboard, and no reward loop engineered to hook a child." },
  { age: "7-12", label: "Story lessons", body: "Short narratives answered out loud, with progress notes a parent can read in under a minute." },
  { age: "Teen+", label: "Grammar in use", body: "Rules taught inside conversation instead of handed over as tables to memorise." },
  { age: "Work", label: "Operating level", body: "Meetings, negotiation and written correspondence marked on register, not vocabulary count." },
  { age: "Exam", label: "Certification tier", body: "HSK 6, CEFR C2, JLPT N1. Timed drills, essay marking and a mock oral with an unforgiving rubric." },
];

const STEPS = [
  { n: "01", title: "Pick a language and a rung", body: "Or sit the two-minute placement so the tutor stops spending your time on material you already own." },
  { n: "02", title: "Speak the line you are given", body: "One tap records. Transcript and four sub-scores land within a couple of seconds." },
  { n: "03", title: "Clear the level", body: "Reach sixty or better across the level checkpoints and the credential unlocks." },
  { n: "04", title: "Anchor it to your wallet", body: "The record is written to Solana devnet. Hand over the signature and anyone can read it back." },
];

export default function HomePage() {
  const featured = TRACKS.filter((track) => track.featured);
  const marquee = [...TRACKS.map((track) => track.language), ...LONG_TAIL];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden">
        <div className="aurora" />
        <div className="grid-veil" />

        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <span className="pill">
                  <span className="h-1.5 w-1.5 rounded-full bg-jade-400" />
                  Running on Solana devnet
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                  Learn the language.
                  <br />
                  <span className="font-[family-name:var(--font-display)] font-normal italic text-jade-300">
                    Keep the proof.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
                  Fluentia is a speaking tutor that marks you the way an examiner
                  would, across more than two hundred languages — from a
                  four-year-old copying sounds to an adult sitting HSK 6. Clear a
                  level and the result is written to a public ledger, which makes
                  it worth something away from this website.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/tutor"
                    className="rounded-xl bg-jade-400 px-5 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
                  >
                    Speak your first line
                  </Link>
                  <Link
                    href="/catalogue"
                    className="rounded-xl border border-line px-5 py-3 text-sm text-paper transition-colors hover:border-white/25"
                  >
                    Browse the catalogue
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                  {[
                    ["200+", "languages open"],
                    ["HSK 6", "top rung on Mandarin"],
                    ["0.25", "USDC for one lesson"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <dt className="text-2xl font-semibold tracking-tight">{value}</dt>
                      <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.2} y={28}>
              <div className="drift">
                <ToneLab />
              </div>
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
            Four things most language apps get wrong, handled differently here
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
          {PILLARS.map((pillar) => (
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
              One catalogue, five life stages
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
              A toddler and a candidate sitting HSK 6 use the same account
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-5">
            {LADDER.map((rung) => (
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
              Start with one of these
            </h2>
            <Link href="/catalogue" className="text-sm text-jade-300 hover:text-jade-400">
              See every track
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((track) => (
            <StaggerItem key={track.slug}>
              <Link href={`/catalogue/${track.slug}`} className="block h-full">
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
              From opening the page to holding a result someone else can check
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
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
              Why involve a ledger at all
            </p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.03em]">
              A certificate is only worth the company standing behind it
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
              <p>
                Language schools close. Apps get shut down. When that happens the
                PDF you were issued becomes a picture of a claim nobody can check,
                and the person who did the work absorbs the loss.
              </p>
              <p>
                Fluentia writes the level, the score and a hash of the graded
                attempt to Solana under your wallet. No audio leaves the grader,
                and reading the record needs no account. A recruiter holding the
                signature confirms it in a browser tab.
              </p>
            </div>
            <Link
              href="/credentials"
              className="mt-7 inline-flex rounded-xl border border-line px-5 py-3 text-sm transition-colors hover:border-jade-400/50"
            >
              Verify a credential
            </Link>
          </Reveal>

          <Reveal delay={0.1} y={26}>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-jade-400/70" />
                <span className="ml-2 text-xs text-muted">memo record · devnet</span>
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
              Say one sentence and see what the examiner makes of it
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
              Three graded rounds cost nothing and need no wallet. If the feedback
              is not sharper than what you are used to, close the tab.
            </p>
            <Link
              href="/tutor"
              className="mt-9 inline-flex rounded-xl bg-jade-400 px-6 py-3.5 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Open the tutor
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
