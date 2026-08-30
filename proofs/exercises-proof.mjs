/**
 * Every exercise on the site, checked one at a time.
 *
 * The claim this suite defends is narrow and worth stating plainly: no question
 * a learner is asked was written by a model. Each one is assembled from a drill
 * line in modules.ts, and each one has exactly one answer that can be traced
 * back to the line it came from. So the suite does not sample. It walks all ten
 * modules, every unit, every generated question, and fails on the first one
 * that has two right answers, no right answer, or an answer that is not in the
 * syllabus.
 */

import {
  buildExercises,
  buildModuleSession,
  countExercises,
  assemble,
  mark,
  normalise,
  tokenise,
  speechLangFor,
} from "./exercises.mjs";
import mods from "./modules.cjs";

const { ALL_MODULES } = mods;

let passes = 0;
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    passes += 1;
  } else {
    failures += 1;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function report(label, detail = "") {
  console.log(`PASS  ${label}${detail ? `  [${detail}]` : ""}`);
}

console.log("\n--- every question in the catalogue ---");

let total = 0;
let choices = 0;
let blanks = 0;
let builds = 0;
let speaks = 0;
const firstFailures = [];

for (const module of ALL_MODULES) {
  const targets = new Set(
    module.units.flatMap((unit) => unit.drills.map((drill) => drill.target))
  );

  for (const unit of module.units) {
    const items = buildExercises(unit, module);
    total += items.length;

    // A unit that generates nothing is a unit the learner cannot practise, and
    // it would be invisible from the page itself.
    if (items.length === 0) firstFailures.push(`${module.code} / ${unit.id} generated nothing`);

    const ids = new Set();
    for (const item of items) {
      if (ids.has(item.id)) firstFailures.push(`duplicate id ${item.id}`);
      ids.add(item.id);

      // Every question, whatever its shape, has to point back at a real line.
      if (!targets.has(item.target)) {
        firstFailures.push(`${item.id} cites a line not in ${module.code}`);
      }

      if (item.kind === "choice") {
        choices += 1;
        if (item.options.length !== 4) {
          firstFailures.push(`${item.id} offered ${item.options.length} options`);
        }
        if (new Set(item.options).size !== item.options.length) {
          firstFailures.push(`${item.id} repeats an option`);
        }
        const correct = item.options.filter((option) => option === item.answer);
        if (correct.length !== 1) {
          firstFailures.push(`${item.id} has ${correct.length} correct options`);
        }
        if (mark(item, item.answer) !== 100) {
          firstFailures.push(`${item.id} does not accept its own answer`);
        }
        for (const option of item.options) {
          if (option !== item.answer && mark(item, option) !== 0) {
            firstFailures.push(`${item.id} accepts a distractor`);
          }
        }
      }

      if (item.kind === "blank") {
        blanks += 1;
        const gaps = item.prompt.split("____").length - 1;
        if (gaps !== 1) firstFailures.push(`${item.id} shows ${gaps} gaps`);
        // Putting the answer back has to rebuild the line exactly. If it does
        // not, the gap was cut in the wrong place.
        if (item.prompt.replace("____", item.answer) !== item.target) {
          firstFailures.push(`${item.id} does not rebuild its line`);
        }
        if (mark(item, item.answer) !== 100) {
          firstFailures.push(`${item.id} rejects its own answer`);
        }
        if (mark(item, `${item.answer}x`) !== 0) {
          firstFailures.push(`${item.id} accepts a wrong word`);
        }
      }

      if (item.kind === "build") {
        builds += 1;
        const expected = tokenise(item.target, module.track);
        const sorted = (list) => [...list].sort().join("|");
        if (sorted(expected) !== sorted(item.tokens)) {
          firstFailures.push(`${item.id} tiles are not the line's own words`);
        }
        if (normalise(assemble(expected, module.track)) !== normalise(item.answer)) {
          firstFailures.push(`${item.id} cannot be reassembled into its answer`);
        }
        if (mark(item, assemble(expected, module.track)) !== 100) {
          firstFailures.push(`${item.id} rejects the correct assembly`);
        }
      }

      if (item.kind === "speak") {
        speaks += 1;
        // A spoken question carries no mark of its own; the grader supplies it.
        if (mark(item, item.prompt) !== 0) {
          firstFailures.push(`${item.id} awarded a mark without a recording`);
        }
      }
    }
  }
}

check("every question resolves to one answer", firstFailures.length === 0, firstFailures[0]);
if (firstFailures.length === 0) {
  report("every question resolves to one answer", `${total} questions across ${ALL_MODULES.length} modules`);
}

console.log(`        ${choices} multiple choice, ${blanks} gap fills, ${builds} sentence builds, ${speaks} spoken`);

check("all four shapes are represented", choices > 0 && blanks > 0 && builds > 0 && speaks > 0);
if (choices > 0 && blanks > 0 && builds > 0 && speaks > 0) {
  report("all four shapes are represented");
}

console.log("\n--- the same quiz twice ---");

const sample = ALL_MODULES[0];
const first = JSON.stringify(buildExercises(sample.units[0], sample));
const second = JSON.stringify(buildExercises(sample.units[0], sample));
check("the generator is deterministic", first === second);
if (first === second) report("the generator is deterministic", "same unit, same paper");

console.log("\n--- one sitting per module ---");

for (const module of ALL_MODULES) {
  const sitting = buildModuleSession(module);
  const all = new Set(
    module.units.flatMap((unit) => buildExercises(unit, module).map((item) => item.id))
  );

  check(`${module.code} sitting is capped`, sitting.length === 20, `got ${sitting.length}`);
  check(
    `${module.code} sitting asks nothing twice`,
    new Set(sitting.map((item) => item.id)).size === sitting.length
  );
  check(
    `${module.code} sitting only asks questions the module has`,
    sitting.every((item) => all.has(item.id))
  );
  // A sitting drawn from one unit would be a chapter test wearing the name of
  // a module.
  const units = new Set(sitting.map((item) => item.id.split(":")[0]));
  check(
    `${module.code} sitting spans the module`,
    units.size === module.units.length,
    `covered ${units.size} of ${module.units.length} units`
  );
}
report("every module has a mixed sitting", "20 questions, drawn across all its units");

check(
  "the sitting is deterministic too",
  JSON.stringify(buildModuleSession(ALL_MODULES[0])) ===
    JSON.stringify(buildModuleSession(ALL_MODULES[0]))
);

console.log("\n--- marking is not lenient about the wrong things ---");

const typed = ALL_MODULES.flatMap((module) =>
  module.units.flatMap((unit) =>
    buildExercises(unit, module).filter((item) => item.kind === "blank")
  )
);
const cased = typed.find((item) => /[a-z]/i.test(item.answer));
if (cased) {
  check("capitals do not fail a right answer", mark(cased, cased.answer.toUpperCase()) === 100);
  check("trailing space does not fail a right answer", mark(cased, ` ${cased.answer} `) === 100);
  report("capitals and spacing are forgiven", cased.answer);
} else {
  check("a typed answer exists to test", false);
}

console.log("\n--- the voice the browser is told to use ---");

check("Mandarin reads as Chinese", speechLangFor("mandarin") === "zh-CN");
check("English reads as English", speechLangFor("english") === "en-US");
check("an unmapped track falls back rather than guessing", speechLangFor("swahili") === "en-US");
report("speech tags map to the track", "zh-CN / en-US");

console.log("\n--- how much of this a person could actually mark by hand ---");

for (const module of ALL_MODULES) {
  console.log(`        ${module.code.padEnd(12)} ${String(countExercises(module)).padStart(4)} questions`);
}

console.log(`\n${passes} passed, ${failures} failed\n`);
process.exit(failures === 0 ? 0 : 1);
