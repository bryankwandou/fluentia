// Audits the written syllabus itself.
//
// The tone grader reads its target out of the numbered pinyin on each drill
// line. If that romanisation is missing, or carries a different number of
// syllables than the line it is supposed to describe, the grader still returns
// a confident number - it just measures the recording against the wrong
// sequence. Nothing else in the suite would notice, because a wrong target is
// indistinguishable from a right one until somebody reads the Chinese.
//
// So the content gets checked the way the code does. This is also the audit a
// reviewer can run to see whether the material is real: it counts what exists
// and refuses to pass on a line that cannot be graded.
import { createRequire } from "node:module";
import { tonesFromPinyin } from "./pitch.mjs";

const require = createRequire(import.meta.url);
const { ALL_MODULES } = require("./modules.cjs");

let pass = 0;
let fail = 0;
const problems = [];

const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

/** Han characters, one per syllable before erhua is taken into account. */
function hanCount(text) {
  return [...text].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
}

/**
 * How many 儿 in this line fused into the syllable before them.
 *
 * Erhua is the one place where characters and syllables come apart: 哪儿 is two
 * characters spoken as one, nar3. But 女儿 and 儿子 are also two characters
 * containing 儿, and there both syllables are real - nv3 er2, er2 zi5. Nothing
 * in the characters separates those cases, and guessing from position gets
 * 女儿 wrong in one direction and 哪儿 wrong in the other. Both mistakes were
 * made here before this was written properly.
 *
 * The romanisation already answers it. A fused 儿 shows up as an r glued to the
 * end of a syllable - nar3, zher4, dianr3 - while a standalone one is spelled
 * er. So the pinyin is asked rather than the characters, and a line only passes
 * if the two accounts of it agree.
 */
function erhuaCount(roman) {
  const tokens = roman.match(/[a-zü]+[1-5]/gi) ?? [];
  return tokens.filter((token) => /r[1-5]$/i.test(token) && !/^er[1-5]$/i.test(token))
    .length;
}

console.log("--- what is actually written ---");
let totalLines = 0;
let totalUnits = 0;
for (const module of ALL_MODULES) {
  const lines = module.units.reduce((sum, unit) => sum + unit.drills.length, 0);
  totalUnits += module.units.length;
  totalLines += lines;
  console.log(
    `   ${module.code.padEnd(12)} ${String(module.units.length).padStart(2)} units  ` +
      `${String(lines).padStart(3)} lines`
  );
}
console.log(`   ${"TOTAL".padEnd(12)} ${totalUnits} units  ${totalLines} lines\n`);

console.log("--- every Mandarin line can actually be graded ---");
const mandarin = ALL_MODULES.filter((module) => module.track === "mandarin");

for (const module of mandarin) {
  for (const unit of module.units) {
    for (const drill of unit.drills) {
      const characters = hanCount(drill.target);
      if (characters === 0) continue;

      const tones = tonesFromPinyin(drill.roman);
      if (tones.length === 0) {
        problems.push(`${unit.id} "${drill.target}" has no numbered pinyin`);
        continue;
      }

      const expected = characters - erhuaCount(drill.roman);
      if (tones.length !== expected) {
        problems.push(
          `${unit.id} "${drill.target}" needs ${expected} syllables but ` +
            `"${drill.roman}" gives ${tones.length}`
        );
      }
    }
  }
}

for (const problem of problems.slice(0, 12)) console.log(`   ${problem}`);
check(
  "every Mandarin drill line carries pinyin the tone grader can read",
  problems.length === 0,
  problems.length ? `${problems.length} lines cannot be graded` : ""
);

console.log("\n--- no line is drilled twice for the same reason ---");
// Repeating a line is not padding when the second pass teaches something the
// first did not. HSK 1 sets 你好 in unit 1 as ni3 hao3, the tones as written,
// and again in unit 6 as ni2 hao3, the tones as spoken - the sandhi unit exists
// to make exactly that comparison. So the identity of a drill is the line plus
// its romanisation, and only an exact pair counts as a duplicate.
const repeats = [];
for (const module of ALL_MODULES) {
  const seen = new Map();
  for (const unit of module.units) {
    for (const drill of unit.drills) {
      const key = `${drill.target}|${drill.roman}`;
      const previous = seen.get(key);
      if (previous) repeats.push(`${module.code}: "${drill.target}" in ${previous} and ${unit.id}`);
      else seen.set(key, unit.id);
    }
  }
}
for (const repeat of repeats.slice(0, 10)) console.log(`   ${repeat}`);
check("no drill is an exact repeat of another", repeats.length === 0, `${repeats.length} repeats`);

console.log("\n--- every unit is teachable on its own ---");
const thin = [];
for (const module of ALL_MODULES) {
  for (const unit of module.units) {
    if (unit.drills.length < 6) thin.push(`${unit.id} has ${unit.drills.length} lines`);
    if (!unit.grammar?.length) thin.push(`${unit.id} states no grammar`);
    if (!unit.examTask) thin.push(`${unit.id} maps to no exam task`);
  }
}
for (const entry of thin.slice(0, 10)) console.log(`   ${entry}`);
check("no unit is missing lines, grammar or an exam task", thin.length === 0);

// Said plainly rather than buried: this is the number that decides whether the
// catalogue is a course or a demonstration, and it is small.
console.log("\n--- how deep the written material goes ---");
const deepest = Math.max(
  ...ALL_MODULES.map((m) => m.units.reduce((s, u) => s + u.drills.length, 0))
);
console.log(`   deepest written rung holds ${deepest} drill lines`);
console.log(`   ${totalLines} written lines across ${ALL_MODULES.length} rungs`);
console.log("   the remaining rungs in the catalogue are taught by the tutor");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
