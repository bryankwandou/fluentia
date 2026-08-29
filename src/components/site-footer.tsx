"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { LocaleToggle } from "./locale-toggle";
import { CHROME } from "@/copy/chrome";
import { localeOf, path } from "@/lib/i18n";

export function SiteFooter() {
  const locale = localeOf(usePathname());
  const copy = CHROME[locale];

  return (
    <footer className="border-t border-line bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {copy.blurb}
            </p>
            <p className="mt-4 text-xs text-muted/70">{copy.devnet}</p>
            <div className="mt-5 flex items-center gap-2.5">
              <span className="text-xs text-muted/70">{copy.language}</span>
              <LocaleToggle />
            </div>
          </div>

          {copy.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs uppercase tracking-[0.14em] text-muted/70">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.external ? link.to : path(locale, link.to)}
                      className="text-sm text-muted transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Fluentia</span>
          <span>{copy.built}</span>
        </div>
      </div>
    </footer>
  );
}
