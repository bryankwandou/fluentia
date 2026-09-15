import type { Level, Track } from "./curriculum";
import { getModule, slugifyModule } from "./modules";

/**
 * Where a rung in the catalogue sends the reader.
 *
 * A rung with a written module opens that module. A rung without one used to
 * open the tutor, which is the metered, Pro-only half of the site, so a
 * reviewer clicking through the catalogue kept landing in a chat window and
 * concluded, fairly, that the catalogue was a front for a chatbot. An unwritten
 * rung now opens its own free page that says what the rung asks for and that
 * nothing is written for it yet. The tutor is offered there as a separate,
 * labelled link, never as the destination of a click on the catalogue.
 *
 * Every page, the JSON catalogue and the link proof use this one function, so
 * they cannot drift apart again.
 */
export function writtenModule(track: Track, level: Level) {
  const found = getModule(slugifyModule(level.code));
  return found?.track === track.slug ? found : null;
}

export function rungHref(track: Track, level: Level) {
  const slug = slugifyModule(level.code);
  return writtenModule(track, level)
    ? `/modules/${slug}`
    : `/catalogue/${track.slug}/${slug}`;
}

export function tutorHref(language: string, level?: string) {
  const query = `language=${encodeURIComponent(language)}`;
  return level
    ? `/tutor?${query}&level=${encodeURIComponent(level)}`
    : `/tutor?${query}`;
}
