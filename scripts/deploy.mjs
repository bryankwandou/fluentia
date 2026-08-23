// Deploy, then point the canonical address at what was just deployed.
//
// `vercel deploy --prod` gives the build its own generated hostname and aliases
// it to one more generated name. It does not touch fluentia.vercel.app, which
// is the address the proofs audit and the address a reader is handed. Those two
// have now drifted apart twice. The first time cost a run of the live suite
// reporting an examiner outage that the deployed commit had already fixed - a
// failure aimed at the wrong cause, which is worse than a quiet one.
//
// Both times the fix was a `vercel alias set` typed by hand afterwards, which
// works exactly as long as somebody remembers. This script is that step written
// down.
import { execFileSync, spawnSync } from "node:child_process";

const CANONICAL = process.env.FLUENTIA_ALIAS ?? "fluentia.vercel.app";

const run = (command, args) => {
  // shell: true because on Windows `vercel` is a .cmd shim, not an executable.
  const result = spawnSync(command, args, { shell: true, encoding: "utf8" });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
};

const die = (message) => {
  console.error(`\n${message}`);
  process.exit(1);
};

// A deployment made from a dirty tree carries a commit SHA that describes
// something other than what shipped, and /api/build would then name a commit
// whose contents nobody can reproduce. Refuse rather than publish that.
const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim();
if (dirty) {
  die(
    `working tree is not clean, so the deployed commit would not describe what shipped:\n${dirty}`
  );
}

const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
console.log(`deploying ${head.slice(0, 7)}\n`);

const output = run("vercel", ["deploy", "--prod", "--yes"]);
process.stdout.write(output);

// The CLI prints the deployment hostname several times over: once while
// building, once on completion, and again inside a JSON summary. Any of them
// will do, so take the last and let the shape of the name do the validating.
const urls = [...output.matchAll(/https:\/\/([a-z0-9-]+\.vercel\.app)/g)].map((m) => m[1]);
const deployed = urls.filter((host) => /-[a-z0-9]{6,}-/.test(host)).pop();

if (!deployed) {
  die("could not find a deployment hostname in the CLI output; the alias was not moved");
}

console.log(`\naliasing ${CANONICAL} -> ${deployed}`);
const aliased = run("vercel", ["alias", "set", deployed, CANONICAL]);
process.stdout.write(aliased);

if (!/Success!/.test(aliased)) {
  die(`the alias did not move. ${CANONICAL} is still serving whatever it served before.`);
}

// Asking the canonical address rather than the deployment's own hostname: the
// question is whether the address people actually visit is serving this commit,
// and only the canonical one can answer that.
const build = await fetch(`https://${CANONICAL}/api/build`, {
  headers: { connection: "close" },
})
  .then((response) => (response.ok ? response.json() : null))
  .catch(() => null);

if (build?.commit !== head) {
  die(
    `${CANONICAL} reports ${build?.commit ?? "nothing"}, expected ${head}.\n` +
      "the alias moved but the address is not serving this commit."
  );
}

console.log(`\n${CANONICAL} is serving ${head.slice(0, 7)}. run \`npm run test:all\` to audit it.`);
