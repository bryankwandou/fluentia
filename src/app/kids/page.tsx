import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kids and early years",
  description:
    "How Fluentia teaches children a language without streak pressure, leaderboards, or anything designed to keep them on the screen.",
};

const PRINCIPLES = [
  {
    title: "No streaks, no leaderboard",
    body: "Children do not need loss aversion engineered into their homework. Progress is shown as a map of what they can now say, and nothing is taken away for missing a day.",
  },
  {
    title: "Voice before letters",
    body: "Under seven, sessions run entirely on listening and speaking. A child who cannot yet read their own alphabet can still finish a lesson properly.",
  },
  {
    title: "Sessions end on their own",
    body: "Each lesson stops after roughly eight minutes and says so. There is no next-episode mechanic waiting to absorb the rest of the afternoon.",
  },
  {
    title: "A parent view that is one screen",
    body: "What was practised, what stuck, what is shaky. No dashboards to interpret and no notifications engineered to guilt anyone.",
  },
];

const ROUTE = [
  { code: "K0", title: "Ears first", body: "Rhythm, song and imitation. The child copies sounds long before meaning is discussed." },
  { code: "K1", title: "Naming the world", body: "Family, food, animals, colours. Around 120 words, all through pictures and speech." },
  { code: "K2", title: "Short sentences", body: "Asking for things, answering simple questions, and holding a four-turn exchange." },
  { code: "YCT / A1", title: "Onto the main ladder", body: "From here the child moves into the same graded track an adult beginner uses." },
];

export default function KidsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <span className="pill">Early years</span>
          <h1 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            Built for a four-year-old without being built to keep them hooked
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            Most children's language apps are engagement products wearing an
            education label. We took the opposite position: short sessions, no
            streak pressure, and a syllabus that hands the child to the main
            ladder as soon as they are ready for it.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
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
            The route a young child takes
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ROUTE.map((rung) => (
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
              href="/tutor?level=K0"
              className="rounded-xl bg-jade-400 px-5 py-3 text-sm font-medium text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              Try a first session
            </Link>
            <Link
              href="/catalogue"
              className="rounded-xl border border-line px-5 py-3 text-sm transition-colors hover:border-white/25"
            >
              See which languages are mapped
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
