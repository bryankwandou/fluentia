import { NextResponse } from "next/server";
import { LONG_TAIL, TRACKS } from "@/lib/curriculum";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

export const runtime = "nodejs";
export const dynamic = "force-static";

/**
 * The whole catalogue as one document.
 *
 * Clicking through every rung to see what is behind it does not scale for
 * anyone checking this work, so the same tree the pages render from is served
 * here in full: every track, every level, the URL that level opens, and
 * whether a written module sits behind it or the tutor generates the lesson.
 *
 * The counts are computed from the data, not typed in. If a module loses a
 * unit the number here drops with it, which is the only way a figure like this
 * is worth anything.
 */
export function GET() {
  const tracks = TRACKS.map((track) => {
    const levels = track.levels.map((level) => {
      const slug = slugifyModule(level.code);
      const found = getModule(slug);
      const written = found?.track === track.slug ? found : null;

      return {
        code: level.code,
        title: level.title,
        stage: level.stage,
        words: level.words,
        hours: level.hours,
        /** "written" carries authored units; "tutor" is generated per session. */
        material: written ? ("written" as const) : ("tutor" as const),
        units: written?.units.length ?? 0,
        drills:
          written?.units.reduce((sum, unit) => sum + unit.drills.length, 0) ?? 0,
        url: written
          ? `/modules/${slug}`
          : `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(level.code)}`,
      };
    });

    return {
      slug: track.slug,
      language: track.language,
      native: track.native,
      family: track.family,
      frameworks: track.frameworks,
      url: `/catalogue/${track.slug}`,
      levels,
    };
  });

  const levels = tracks.flatMap((track) => track.levels);
  const written = levels.filter((level) => level.material === "written");

  // Every address the catalogue can send a reader to, flattened and deduped.
  //
  // /audit walks this list from the visitor's own browser, which is the only
  // form of "the links work" worth anything to someone who was told they did
  // and found otherwise. Serving the list rather than hard-coding it in the
  // page means a level added tomorrow is audited tomorrow, and a level removed
  // stops being claimed.
  const destinations = [
    ...new Set([
      "/",
      // The audit page and this document are in the list on purpose. A check
      // that exempts itself is the first place a reader should look.
      "/audit",
      "/audit/ringkasan",
      "/api/catalogue",
      "/catalogue",
      "/coverage",
      "/credentials",
      "/kids",
      "/manifesto",
      "/modules",
      "/pricing",
      "/tutor",
      ...tracks.map((track) => track.url),
      ...levels.map((level) => level.url),
      ...ALL_MODULES.map((module) => `/modules/${slugifyModule(module.code)}`),
    ]),
  ];

  return NextResponse.json({
    generated: "static, at build time",
    destinations,
    totals: {
      tracks: tracks.length,
      levels: levels.length,
      writtenLevels: written.length,
      tutorLevels: levels.length - written.length,
      modules: ALL_MODULES.length,
      units: written.reduce((sum, level) => sum + level.units, 0),
      drills: written.reduce((sum, level) => sum + level.drills, 0),
      // Advertised on the marketing pages but carrying no ladder of their own:
      // the tutor handles them, and saying so is better than implying parity.
      longTailLanguages: LONG_TAIL.length,
    },
    tracks,
    longTail: LONG_TAIL,
  });
}
