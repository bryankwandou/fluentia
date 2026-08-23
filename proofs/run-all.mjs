// Every proof in one run. Suites that need devnet or the live deployment are
// skipped unless asked for, so `npm test` stays offline and fast by default.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OFFLINE = [
  ["tone detection, Mandarin", "tone-proof.mjs"],
  ["tone detection, Cantonese", "cantonese-proof.mjs"],
  ["tone detection, Vietnamese", "vietnamese-proof.mjs"],
  ["settlement arithmetic", "settle-proof.mjs"],
  ["review scheduling", "srs-proof.mjs"],
  ["thirty days of a learner's deck", "deck-proof.mjs"],
];

const NETWORKED = [
  ["provider models still exist", "model-proof.mjs", "live"],
  ["replay guard (devnet)", "replay-proof.mjs", "devnet"],
  ["speech pipeline (live deployment)", "speech-proof.mjs", "live"],
  ["every catalogue destination (live deployment)", "links-proof.mjs", "live"],
];

const wanted = process.argv.slice(2);
const all = wanted.includes("--all");
const suites = [
  ...OFFLINE,
  ...NETWORKED.filter(() => all || wanted.includes("--network")),
];

const results = [];

for (const [name, file] of suites) {
  // fileURLToPath rather than .pathname: on Windows the latter yields
  // "/E:/..." which no filesystem call will accept.
  const path = fileURLToPath(new URL(file, import.meta.url));
  if (!existsSync(path)) {
    console.log(`\n### ${name}: missing ${file}`);
    results.push([name, false]);
    continue;
  }

  console.log(`\n${"=".repeat(64)}\n${name}\n${"=".repeat(64)}`);
  const run = spawnSync(process.execPath, [path], { stdio: "inherit" });
  results.push([name, run.status === 0]);
}

console.log(`\n${"=".repeat(64)}`);
let failed = 0;
for (const [name, ok] of results) {
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${name}`);
}
console.log(`${"=".repeat(64)}`);
console.log(
  failed
    ? `${failed} of ${results.length} suites failed`
    : `all ${results.length} suites passed`
);

if (!all && !wanted.includes("--network")) {
  console.log("\n(devnet and live-deployment suites skipped; run `npm run test:all`)");
}

process.exit(failed ? 1 : 0);
