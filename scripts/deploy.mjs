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
import https from "node:https";

const CANONICAL = process.env.FLUENTIA_ALIAS ?? "fluentia.vercel.app";

const run = (command, args) => {
  // shell: true because on Windows `vercel` is a .cmd shim, not an executable.
  const result = spawnSync(command, args, { shell: true, encoding: "utf8" });
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
};

// Halt carries a message that has already been written for a reader, so the
// handler at the bottom prints it and nothing else. A stack trace here would
// only point at this file, which is not where the problem is.
class Halt extends Error {}
const die = (message) => {
  throw new Halt(message);
};

// node:https with keepAlive off, rather than fetch.
//
// The first run of this script did its job - deployed, moved the alias, and the
// address was serving the right commit - and then died on the way out with
// 0xC0000409, losing its own closing line. That is the Windows libuv assertion
// the proofs already work around: the process tears down while a pooled socket
// is still closing. fetch keeps that pool alive behind undici and there is no
// supported way to drain it from here, so this asks over a connection it owns
// and can close.
function askBuild() {
  return new Promise((resolve) => {
    const request = https.get(
      `https://${CANONICAL}/api/build`,
      { agent: new https.Agent({ keepAlive: false }) },
      (response) => {
        let body = "";
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () => {
          try {
            resolve(response.statusCode === 200 ? JSON.parse(body) : null);
          } catch {
            resolve(null);
          }
        });
      }
    );
    request.on("error", () => resolve(null));
    request.setTimeout(10000, () => {
      request.destroy();
      resolve(null);
    });
  });
}

async function main() {
  // A deployment made from a dirty tree carries a commit SHA that describes
  // something other than what shipped, and /api/build would then name a commit
  // whose contents nobody can reproduce. Refuse rather than publish that.
  const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim();
  if (dirty) {
    die(`working tree is not clean, so the deployed commit would not describe what shipped:\n${dirty}`);
  }

  const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  console.log(`deploying ${head.slice(0, 7)}\n`);

  const output = run("vercel", ["deploy", "--prod", "--yes"]);
  process.stdout.write(output);

  // The CLI prints the deployment hostname several times over: while building,
  // on completion, and again inside a JSON summary. Any of them will do, so
  // take the last and let the shape of the name do the validating. The name
  // Vercel auto-aliases to (fluentia-virid) has no build id in it and is
  // filtered out here, which is the whole reason this script exists.
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

  // An alias is not served the instant the CLI says Success. Asking once and
  // failing would turn ordinary propagation into a red deploy, and a red deploy
  // nobody believes is worse than no check at all.
  let build = null;
  for (let attempt = 1; attempt <= 5; attempt++) {
    build = await askBuild();
    if (build?.commit === head) break;
    if (attempt < 5) {
      console.log(`   ${CANONICAL} not serving ${head.slice(0, 7)} yet, waiting 3s`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  if (build?.commit !== head) {
    die(
      `${CANONICAL} reports ${build?.commit ?? "nothing"}, expected ${head}.\n` +
        "the alias moved but the address is not serving this commit."
    );
  }

  console.log(`\n${CANONICAL} is serving ${head.slice(0, 7)}. run \`npm run test:all\` to audit it.`);
}

try {
  await main();
} catch (error) {
  console.error(`\n${error instanceof Halt ? error.message : error}`);
  process.exitCode = 1;
}
