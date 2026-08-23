// Asks the address under audit which commit it is serving.
//
// Everything else in the live half of this suite assumes that
// https://fluentia.vercel.app is the code in this working tree. That assumption
// was wrong for a while and nothing said so: `vercel deploy --prod` aliases a
// deployment to a generated hostname and leaves the canonical one where it was,
// so the proofs kept auditing an older build. The run that caught it reported
// an examiner outage which the deployed commit had already fixed - a genuine
// failure pointing at the wrong cause, which is worse than a quiet one.
//
// So the first live check is now the cheapest one: is this URL running what we
// are about to test.
import { execFileSync } from "node:child_process";

const BASE = process.argv[2] ?? "https://fluentia.vercel.app";

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

let build = null;
try {
  const response = await fetch(`${BASE}/api/build`, { headers: { connection: "close" } });
  build = response.ok ? await response.json() : null;
  if (!response.ok) console.log(`   ${BASE}/api/build returned ${response.status}`);
} catch (error) {
  console.log(`   ${BASE}/api/build could not be reached: ${error.message}`);
}

console.log(`   local HEAD   ${head}`);
console.log(`   deployed     ${build?.commit ?? "unknown"}`);
console.log(`   models       ${build?.chatModel ?? "?"} / ${build?.audioModel ?? "?"}\n`);

check(
  `${BASE} reports which commit it is serving`,
  Boolean(build?.commit),
  build ? "" : "no /api/build; the suite cannot tell what it is auditing"
);

// Not an equality check on principle: a deployment made from a dirty tree, or a
// local run against a colleague's URL, is a normal thing to do. What is not
// normal is auditing a URL whose code nobody can name, or one running a commit
// this branch has never contained.
if (build?.commit && build.commit !== "local") {
  let known = false;
  try {
    execFileSync("git", ["cat-file", "-e", `${build.commit}^{commit}`], { stdio: "ignore" });
    known = true;
  } catch {
    known = false;
  }
  check(
    "the deployed commit exists in this repository",
    known,
    known ? "" : `${build.commit} is unknown here - the URL is running something else`
  );

  if (build.commit !== head) {
    console.log(
      `\n   note: ${BASE} is ${build.commit.slice(0, 7)}, this tree is ${head.slice(0, 7)}.`
    );
    console.log("   every live result below describes the deployed commit, not this one.");
  }
}

console.log(`\n${pass} passed, ${fail} failed`);

// exitCode, not exit(): Node on Windows trips a libuv assertion when the
// process tears down while a socket from the fetch above is still closing, and
// the suite reads that crash as a failed proof. Setting the code lets the loop
// drain and the status is reported once the socket has gone.
process.exitCode = fail ? 1 : 0;
