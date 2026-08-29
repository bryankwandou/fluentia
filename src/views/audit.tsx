import Link from "next/link";
import { LinkAudit } from "@/components/link-audit";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { AUDIT } from "@/copy/proof";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { path, type Locale } from "@/lib/i18n";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

/**
 * Each claim paired with the thing that would show it up.
 *
 * The claims themselves live in the copy dictionary because they are read by
 * people in two languages, but the shape is the point: the third field says
 * what a reader would see if the first were false. A claim nobody can disprove
 * is not evidence. Two of these have already fired and caught real faults.
 */
export function Audit({ locale }: { locale: Locale }) {
  const copy = AUDIT[locale];
  const other: Locale = locale === "en" ? "id" : "en";

  const rows = TRACKS.flatMap((track) =>
    track.levels.map((level) => {
      const found = getModule(slugifyModule(level.code));
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
          <span className="pill">{copy.pill}</span>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.035em]">
            {copy.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted">
            {copy.lead}
          </p>
          <p className="mt-3.5 text-[13px] text-muted/70">
            <Link
              href={path(other, "/audit")}
              hrefLang={other}
              className="text-jade-300 underline underline-offset-4"
            >
              {copy.otherLanguage}
            </Link>
          </p>
        </Reveal>

        <div className="mt-10">
          <Reveal>
            <LinkAudit locale={locale} />
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              {copy.complaintHeading}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {copy.complaint[0]}
            </p>
            <p className="mt-3.5 text-[15px] leading-relaxed text-muted">
              {copy.complaint[1]}{" "}
              <Link
                href="/api/build"
                className="text-jade-300 underline underline-offset-4"
              >
                /api/build
              </Link>
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              {copy.claimsHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              {copy.claimsLead}
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {copy.claims.map((row) => (
            <StaggerItem key={row.claim} className="bg-ink-950">
              <div className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr] sm:gap-6 sm:p-6">
                <p className="text-sm font-medium leading-relaxed">{row.claim}</p>
                <div>
                  <p className="text-[13px] leading-relaxed text-muted">{row.check}</p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted/70">
                    <span className="text-muted">{copy.ifFalse}</span>
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
              {copy.runHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
              {copy.runLead}
            </p>
          </div>
        </Reveal>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-ink-900/50 p-5">
          <pre className="text-[13px] leading-relaxed text-muted">
            <code>{`git clone https://github.com/bryankwandou/fluentia
cd fluentia
npm install
npm test
npm run test:all`}</code>
          </pre>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-muted/70">{copy.runNote}</p>

        <Reveal>
          <div className="mt-16">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-[-0.03em]">
              {copy.limitsHeading}
            </h2>
            <ul className="mt-6 space-y-4">
              {copy.limits.map((limit) => (
                <li key={limit} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                  <span className="text-[15px] leading-relaxed text-muted">{limit}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-jade-400" />
                <span className="text-[15px] leading-relaxed text-muted">
                  {copy.rungLimit(
                    writtenRows.length,
                    rows.length,
                    units,
                    LONG_TAIL.length
                  )}{" "}
                  <Link
                    href={path(locale, "/coverage")}
                    className="text-jade-300 underline underline-offset-4"
                  >
                    {copy.coverageLink}
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 border-t border-line pt-8">
            <p className="text-[15px] leading-relaxed text-muted">{copy.closing}</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
