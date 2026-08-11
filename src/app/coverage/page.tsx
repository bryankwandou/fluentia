import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Coverage",
  description:
    "Every track and every rung in one table, with what sits behind each one and where it goes.",
};

/**
 * Written for whoever has to check this rather than for whoever has to be sold
 * it. One table, every rung, every link, and the parts that are thin left
 * visible instead of padded out.
 */
export default function CoveragePage() {
  const rows = TRACKS.flatMap((track) =>
    track.levels.map((level) => {
      const slug = slugifyModule(level.code);
      const found = getModule(slug);
      const written = found?.track === track.slug ? found : null;
      return {
        track,
        level,
        written,
        units: written?.units.length ?? 0,
        drills:
          written?.units.reduce((sum, unit) => sum + unit.drills.length, 0) ?? 0,
        href: written
          ? `/modules/${slug}`
          : `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(level.code)}`,
      };
    })
  );

  const writtenRows = rows.filter((row) => row.written);
  const totalUnits = writtenRows.reduce((sum, row) => sum + row.units, 0);
  const totalDrills = writtenRows.reduce((sum, row) => sum + row.drills, 0);

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <Reveal>
          <h1 className="text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.035em]">
            What is actually here
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Every rung of every ladder, with the link it opens and what sits
            behind it. Rungs marked <span className="text-jade-300">written</span>{" "}
            have authored units and drill lines with numbered pinyin, which is
            what the tone grader measures against. The rest are taught by the
            tutor, grounded on the level descriptor rather than a written unit.
            Both are usable; they are not the same thing, so they are not
            counted as the same thing.
          </p>
          <p className="mt-3 text-[13px] text-muted/70">
            The same tree is served as JSON at{" "}
            <Link href="/api/catalogue" className="text-jade-300 underline underline-offset-4">
              /api/catalogue
            </Link>{" "}
            if you would rather diff it than read it.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
            {[
              [String(TRACKS.length), "tracks with a ladder"],
              [`${writtenRows.length} of ${rows.length}`, "rungs with written units"],
              [String(totalUnits), "authored units"],
              [String(totalDrills), "drill lines"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-xl font-semibold tracking-tight">{value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-muted/70">
                  <th className="pb-3 font-normal">Track</th>
                  <th className="pb-3 font-normal">Rung</th>
                  <th className="pb-3 font-normal">Material</th>
                  <th className="pb-3 text-right font-normal">Units</th>
                  <th className="pb-3 text-right font-normal">Lines</th>
                  <th className="pb-3 text-right font-normal">Opens</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.track.slug}-${row.level.code}`}
                    className="border-b border-line/60"
                  >
                    <td className="py-2.5 text-muted">
                      <Link
                        href={`/catalogue/${row.track.slug}`}
                        className="hover:text-paper"
                      >
                        {row.track.language}
                      </Link>
                    </td>
                    <td className="py-2.5">
                      {row.level.code}
                      <span className="ml-2 text-muted/70">{row.level.title}</span>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={
                          row.written
                            ? "rounded-md border border-jade-400/40 bg-jade-500/10 px-2 py-0.5 text-[11px] text-jade-300"
                            : "rounded-md border border-line px-2 py-0.5 text-[11px] text-muted/70"
                        }
                      >
                        {row.written ? "written" : "tutor-led"}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted">
                      {row.units || "—"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted">
                      {row.drills || "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={row.href}
                        className="text-jade-300 underline underline-offset-4"
                      >
                        {row.href}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="card mt-10 p-6">
            <h2 className="text-base font-medium">Where it is thin</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Written units exist for {ALL_MODULES.length} modules across two
              tracks: HSK 1 through 6 in Mandarin, and Foundation through
              TOEFL 100 in English. Every other rung on this page runs on the
              tutor, which is grounded on the level descriptor and the track
              rather than on authored lines. That is a real difference: the tone
              grader needs numbered pinyin to measure against, so tone scoring
              on a tutor-led rung falls back to whatever romanisation the model
              supplies for the line it just set.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              A further {LONG_TAIL.length} languages are reachable in the tutor
              without a ladder of their own. They are listed on the catalogue as
              what they are — conversation practice — and are deliberately absent
              from the table above, which counts rungs, not languages.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
