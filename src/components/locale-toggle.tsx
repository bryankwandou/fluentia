"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_NAME, LOCALE_SHORT, localeOf, swap } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Two links rather than a dropdown or a stored preference.
 *
 * The other locale of the page you are on is an address, so it should behave
 * like one: visible before you click, openable in a new tab, and safe to paste
 * into a document. A control that switched language by writing to storage would
 * give a reader no way to send someone the page they were actually reading,
 * which matters more than usual when the page exists to be checked by a third
 * party.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const pathname = usePathname();
  const current = localeOf(pathname);

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-line p-0.5",
        className
      )}
    >
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={swap(pathname, locale)}
            hrefLang={locale}
            aria-label={LOCALE_NAME[locale]}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              active
                ? "bg-white/8 text-paper"
                : "text-muted hover:text-paper"
            )}
          >
            {LOCALE_SHORT[locale]}
          </Link>
        );
      })}
    </div>
  );
}
