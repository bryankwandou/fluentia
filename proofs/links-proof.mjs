// Walks every destination the catalogue can produce and asks the deployment
// for each one. The complaint this answers is that the rungs on a track page
// looked interactive and went nowhere, so the check is deliberately literal:
// build the same hrefs the page builds, from the same data, and require every
// one of them to come back 200.
import { createRequire } from "node:module";
import { TRACKS, LONG_TAIL } from "./curriculum.mjs";

const require = createRequire(import.meta.url);
const { ALL_MODULES, getModule, slugifyModule } = require("./modules.cjs");

const BASE = process.argv[2] ?? "https://fluentia.vercel.app";

/** Same rule the track page and /api/catalogue apply. */
function hrefFor(track, level) {
  const slug = slugifyModule(level.code);
  const found = getModule(slug);
  const written = found?.track === track.slug ? found : null;
  return written
    ? `/modules/${slug}`
    : `/tutor?language=${encodeURIComponent(track.language)}&level=${encodeURIComponent(level.code)}`;
}

const targets = [];
const add = (path, note) => targets.push({ path, note });

for (const path of [
  "/",
  "/catalogue",
  "/coverage",
  "/credentials",
  "/kids",
  "/manifesto",
  "/modules",
  "/pricing",
  "/tutor",
  "/api/catalogue",
]) {
  add(path, "top level");
}

for (const track of TRACKS) {
  add(`/catalogue/${track.slug}`, "track page");
  for (const level of track.levels) {
    add(hrefFor(track, level), `${track.language} ${level.code}`);
  }
}

for (const module of ALL_MODULES) {
  add(`/modules/${slugifyModule(module.code)}`, `module ${module.code}`);
}

// Same path twice tells us nothing the first visit did not.
const seen = new Set();
const unique = targets.filter(({ path }) => {
  if (seen.has(path)) return false;
  seen.add(path);
  return true;
});

console.log(
  `${TRACKS.length} tracks, ${ALL_MODULES.length} written modules, ` +
    `${LONG_TAIL.length} long-tail languages`
);
console.log(`checking ${unique.length} distinct destinations against ${BASE}\n`);

async function visit({ path, note }) {
  try {
    const response = await fetch(`${BASE}${path}`, {
      redirect: "follow",
      headers: { connection: "close" },
    });
    return { path, note, status: response.status, ok: response.status === 200 };
  } catch (cause) {
    return { path, note, status: 0, ok: false, error: String(cause) };
  }
}

const results = [];
for (let i = 0; i < unique.length; i += 6) {
  results.push(...(await Promise.all(unique.slice(i, i + 6).map(visit))));
}

const broken = results.filter((result) => !result.ok);

for (const result of broken) {
  console.log(`  ${String(result.status).padStart(3)}  ${result.path}  (${result.note})`);
}

console.log(
  broken.length
    ? `\n${broken.length} of ${results.length} destinations did not return 200 -> FAIL`
    : `\nall ${results.length} destinations returned 200 -> PASS`
);

// The point of the exercise is that no rung is a dead end, so that gets its
// own line rather than being buried in the total.
const rungs = TRACKS.flatMap((track) =>
  track.levels.map((level) => hrefFor(track, level))
);
const rungPaths = new Set(rungs);
const brokenRungs = broken.filter((result) => rungPaths.has(result.path));
console.log(
  `every rung on every track page resolves: ${
    brokenRungs.length === 0 ? "PASS" : `FAIL (${brokenRungs.length} dead)`
  }  [${rungPaths.size} distinct destinations behind ${rungs.length} cards]`
);

process.exitCode = broken.length ? 1 : 0;
