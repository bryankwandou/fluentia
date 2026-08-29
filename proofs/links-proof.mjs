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
  "/audit",
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

// Everything above exists in Indonesian too, at the same address under /id.
// A page that answers in one language and 404s in the other is a half-finished
// translation wearing a toggle, so the mirror is walked rather than assumed.
for (const { path, note } of [...targets]) {
  if (path.startsWith("/api/")) continue;
  add(path === "/" ? "/id" : `/id${path}`, `${note}, id`);
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

// /audit walks the list the deployment serves; this file builds its own from
// the repository. If those two ever differ, the page is auditing a set the
// repository does not describe, and the count a reader is shown stops meaning
// what it says. Comparing them is the only way that stays true on its own.
let agrees = false;
try {
  const served = await (await fetch(`${BASE}/api/catalogue`)).json();
  const there = new Set(served.destinations ?? []);
  const missing = [...seen].filter((path) => !there.has(path));
  const extra = [...there].filter((path) => !seen.has(path));
  agrees = missing.length === 0 && extra.length === 0;

  for (const path of missing) console.log(`  only in the repository: ${path}`);
  for (const path of extra) console.log(`  only in the served list:  ${path}`);
  console.log(
    `the list /audit walks matches this one: ${agrees ? "PASS" : "FAIL"}  [${there.size} served, ${seen.size} built here]`
  );
} catch (cause) {
  console.log(`the list /audit walks matches this one: FAIL (${cause})`);
}

process.exitCode = broken.length || !agrees ? 1 : 0;
