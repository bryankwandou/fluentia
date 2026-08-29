/**
 * Two locales, and the English one keeps the bare paths.
 *
 * Every address already handed out points at an unprefixed path, and some of
 * those are in documents we cannot edit. Moving English under /en would break
 * all of them to gain tidiness, so Indonesian mirrors under /id instead and
 * nothing that already works stops working.
 */
export const LOCALES = ["en", "id"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Each language named in itself, which is the only form a reader recognises. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

/** Short form for the toggle, where there is room for two letters and no more. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  id: "ID",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * A site path as it should be written for one locale.
 *
 * Call this for every internal link rather than writing the prefix by hand.
 * A link that forgets it drops the reader back into English mid-journey, which
 * is the failure this whole layer exists to avoid and the one that is easiest
 * to miss in review.
 */
export function path(locale: Locale, to: string): string {
  if (locale === DEFAULT_LOCALE) return to;
  return to === "/" ? "/id" : `/id${to}`;
}

/** The locale a pathname is being served in. */
export function localeOf(pathname: string): Locale {
  return pathname === "/id" || pathname.startsWith("/id/") ? "id" : "en";
}

/** The same page in the other locale, for the toggle. */
export function swap(pathname: string, to: Locale): string {
  const bare =
    pathname === "/id"
      ? "/"
      : pathname.startsWith("/id/")
        ? pathname.slice(3)
        : pathname;
  return path(to, bare || "/");
}
