import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { MANIFESTO } from "@/copy/pages";
import { path, type Locale } from "@/lib/i18n";

const SOURCE = "https://github.com/bryankwandou/fluentia";

export function Manifesto({ locale }: { locale: Locale }) {
  const copy = MANIFESTO[locale];

  return (
    <div className="relative overflow-hidden">
      <div className="aurora opacity-50" />

      <div className="relative mx-auto max-w-2xl px-5 py-16 sm:py-24">
        <Reveal>
          <span className="pill">{copy.pill}</span>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em]">
            {copy.heading}
          </h1>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 space-y-6 text-[16px] leading-[1.75] text-muted">
            {copy.paragraphs.map((group, index) => (
              <div key={group[0].slice(0, 24)} className="space-y-6">
                {index > 0 && <div className="hairline my-10" />}
                {group.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href={path(locale, "/tutor")}
              className="btn btn-primary px-5 py-3 text-sm"
            >
              {copy.ctaPrimary}
            </Link>
            <Link href={SOURCE} className="btn btn-ghost px-5 py-3 text-sm">
              {copy.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
