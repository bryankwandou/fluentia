import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { COVERAGE } from "@/copy/proof";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { path, type Locale } from "@/lib/i18n";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

/**
 * Written for whoever has to check this rather than for whoever has to be sold
 * it. One table, every rung, every link, and the parts that are thin left
 * visible instead of padded out.
 */
export function Coverage({ locale }: { locale: Locale }) {
  const copy = COVERAGE[locale];

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
        href: path(
          locale,
          written
            ? `/modules/${slug}`
            : `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(level.code)}`
        ),
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
            {copy.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            {copy.lead}
          </p>
          <p className="mt-3 text-[13px] text-muted/70">
            {copy.jsonNote[0]}{" "}
            <Link
              href="/api/catalogue"
              className="text-jade-300 underline underline-offset-4"
            >
              /api/catalogue
            </Link>{" "}
            {copy.jsonNote[1]}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
            {[
              [String(TRACKS.length), copy.stats[0]],
              [`${writtenRows.length} / ${rows.length}`, copy.stats[1]],
              [String(totalUnits), copy.stats[2]],
              [String(totalDrills), copy.stats[3]],
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
                  {copy.columns.map((column, index) => (
                    <th
                      key={column}
                      className={
                        index > 2 ? "pb-3 text-right font-normal" : "pb-3 font-normal"
                      }
                    >
                      {column}
                    </th>
                  ))}
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
                        href={path(locale, `/catalogue/${row.track.slug}`)}
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
                        {row.written ? copy.written : copy.tutorLed}
                      </span>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted">
                      {row.units || "-"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-muted">
                      {row.drills || "-"}
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
            <h2 className="text-base font-medium">{copy.thinHeading}</h2>
            {copy.thin(ALL_MODULES.length, LONG_TAIL.length).map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 text-[13.5px] leading-relaxed text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
