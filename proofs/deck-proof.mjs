// The scheduler is proved in isolation elsewhere. This runs the thing the
// console actually does: thirty days of sessions over a fixed set of drill
// lines, where each line is answered at the level a real learner would manage,
// and checks the deck behaves the way the interface promises it will.
import { buildQueue, cardId, newReview, schedule, summarise, PASS_MARK } from "./srs.mjs";

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

const day = (n) => new Date(2026, 0, 1 + n);
const LANGUAGE = "Mandarin Chinese";

// Eight HSK 1 lines and the score this learner reliably gets on each. The
// last one is the line they cannot say; everything else they get right.
const LINES = [
  ["你好", 96],
  ["谢谢", 94],
  ["再见", 92],
  ["我叫王明", 88],
  ["你是哪国人", 84],
  ["我不会说中文", 78],
  ["请再说一遍", 72],
  ["四是四十是十", 45],
];

const ids = LINES.map(([target]) => cardId(LANGUAGE, target));
const scoreFor = new Map(LINES.map(([target, score]) => [cardId(LANGUAGE, target), score]));

console.log("--- card identity ---");
check(
  "the same line in two languages is two cards",
  cardId("Mandarin Chinese", "你好") !== cardId("Cantonese", "你好")
);

console.log("\n--- thirty days of sessions, six lines per session ---");
let deck = [];
const appearances = new Map(ids.map((id) => [id, 0]));
const sessionSizes = [];

for (let d = 0; d < 30; d++) {
  const now = day(d);
  const queue = buildQueue(deck, ids, 6, now);
  sessionSizes.push(queue.length);

  for (const card of queue) {
    appearances.set(card.id, appearances.get(card.id) + 1);
    // The learner's score wobbles a little but never crosses the pass mark in
    // either direction; the point here is the schedule, not the grader.
    const base = scoreFor.get(card.id);
    const score = base + ((d % 3) - 1) * 2;
    const advanced = schedule(deck.find((r) => r.id === card.id) ?? newReview(card.id, now), score, now);
    deck = [...deck.filter((r) => r.id !== card.id), advanced];
  }
}

for (const [target] of LINES) {
  const id = cardId(LANGUAGE, target);
  const card = deck.find((r) => r.id === id);
  console.log(
    `        ${target.padEnd(14)} seen ${String(appearances.get(id)).padStart(2)}x` +
      `  streak ${String(card.streak).padStart(2)}  ease ${card.ease}  interval ${card.interval}d`
  );
}

check("every line entered the deck", deck.length === LINES.length);
check("no session ran past its limit", sessionSizes.every((n) => n <= 6));

const hard = cardId(LANGUAGE, "四是四十是十");
const easy = cardId(LANGUAGE, "你好");
check(
  "the line the learner keeps failing is drilled far more often",
  appearances.get(hard) > appearances.get(easy) * 3,
  `hard ${appearances.get(hard)}x vs easy ${appearances.get(easy)}x`
);
check(
  "the failing line never leaves same-day practice",
  deck.find((r) => r.id === hard).interval === 0
);
check(
  "the mastered line is parked weeks out",
  deck.find((r) => r.id === easy).interval >= 21,
  `interval ${deck.find((r) => r.id === easy).interval}d`
);

console.log("\n--- what the panel shows after thirty days ---");
const progress = summarise(deck, day(29));
console.log("       ", JSON.stringify(progress));
check("retained lines are counted", progress.mature >= 3);
check("the failing line is still due", progress.dueNow >= 1);
check(
  "the mean sits between the best and worst line",
  progress.meanScore > 45 && progress.meanScore < 96,
  `mean ${progress.meanScore}`
);

console.log("\n--- a lapse on a mature line ---");
const mature = deck.find((r) => r.id === easy);
const slipped = schedule(mature, PASS_MARK - 5, day(30));
console.log(`        ${mature.interval}d at ease ${mature.ease} -> ${slipped.interval}d at ease ${slipped.ease}`);
check("one bad recording brings a mature line straight back", slipped.interval === 0);
check("but it does not erase the ease that line earned", slipped.ease > 1.3);

console.log("\n--- recovery after the lapse ---");
let recovering = slipped;
for (let d = 0; d < 4; d++) recovering = schedule(recovering, 94, day(31 + d));
console.log(`        back to ${recovering.interval}d after four clean attempts`);
check("a recovered line climbs the ladder again", recovering.interval > 6);
check(
  "recovery is slower than the first climb was",
  recovering.interval < mature.interval,
  `${recovering.interval}d vs the ${mature.interval}d it had before`
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
