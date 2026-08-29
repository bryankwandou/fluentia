"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { LocaleToggle } from "./locale-toggle";
import { CHROME } from "@/copy/chrome";
import { localeOf, path } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const locale = localeOf(pathname);
  const copy = CHROME[locale];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // The layout is shared by both locales, so the lang attribute cannot be set
  // where the rest of the document is written. A screen reader given the wrong
  // one pronounces the page in the wrong language, which is worse for the
  // reader who most depends on it, so it is corrected here on every navigation.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href={path(locale, "/")} aria-label="Fluentia">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {copy.nav.map((link) => {
            const href = path(locale, link.to);
            const active =
              href === path(locale, "/")
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={link.to}
                href={href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm transition-colors",
                  active ? "text-paper" : "text-muted hover:text-paper"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LocaleToggle className="hidden sm:flex" />
          <Link
            href={path(locale, "/tutor")}
            className="btn btn-primary hidden px-4 py-2 text-sm lg:inline-flex"
          >
            {copy.cta}
          </Link>
          <button
            type="button"
            aria-label={copy.menu.label}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-line px-3 py-2 text-sm text-muted md:hidden"
          >
            {open ? copy.menu.close : copy.menu.open}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink-950/95 px-5 py-3 md:hidden">
          {copy.nav.map((link) => (
            <Link
              key={link.to}
              href={path(locale, link.to)}
              className="block rounded-lg px-2 py-2.5 text-sm text-muted hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-line px-2 pt-3">
            <span className="text-xs text-muted/70">{copy.language}</span>
            <LocaleToggle />
          </div>
        </div>
      )}
    </header>
  );
}
