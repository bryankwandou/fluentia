// The scheduler decides when a line comes back. These check the curve behaves
// the way spaced repetition is supposed to, driven by the objective grade
// rather than by anything the learner claims about their own recall.
import { newReview, schedule, quality, due, summarise, buildQueue, PASS_MARK } from "./srs.mjs";

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

const day = (n) => new Date(2026, 0, 1 + n);

console.log("--- grade mapping ---");
check("95 and above is a perfect recall", quality(96) === 5);
check("the pass mark maps to the lowest passing quality", quality(PASS_MARK) === 3);
check("just under the pass mark is a lapse", quality(PASS_MARK - 1) < 3);

console.log("\n--- the interval ladder on repeated passes ---");
let card = newReview("ni3 hao3", day(0));
const ladder = [];
for (let i = 0; i < 6; i++) {
  card = schedule(card, 92, day(i));
  ladder.push(card.interval);
}
console.log("        intervals:", ladder.join(", "), "days");
check("first pass comes back tomorrow", ladder[0] === 1);
check("second pass jumps to six days", ladder[1] === 6);
check("intervals grow after that", ladder[2] > 6 && ladder[3] > ladder[2]);
// SM-2 treats a solid-but-imperfect answer as neutral: the interval grows,
// the ease does not. Only a near-perfect answer earns more ease.
check("a solid pass leaves ease untouched", card.ease === 2.5, `ease ${card.ease}`);
check("a perfect pass raises ease",
  schedule(newReview("perfect", day(0)), 99, day(0)).ease > 2.5);

console.log("\n--- a lapse ---");
const strong = { ...card };
const lapsed = schedule(strong, 40, day(9));
console.log(`        before: interval ${strong.interval}d ease ${strong.ease} streak ${strong.streak}`);
console.log(`        after:  interval ${lapsed.interval}d ease ${lapsed.ease} streak ${lapsed.streak}`);
check("a failed attempt returns the card to same-day practice", lapsed.interval === 0);
check("the streak resets", lapsed.streak === 0);
check("ease drops but is not destroyed", lapsed.ease < strong.ease && lapsed.ease >= 1.3);
check("attempts keep counting", lapsed.attempts === strong.attempts + 1);

console.log("\n--- ease floor holds under repeated failure ---");
let struggling = newReview("nan2 de5", day(0));
for (let i = 0; i < 12; i++) struggling = schedule(struggling, 10, day(i));
check("ease never falls below 1.3", struggling.ease >= 1.3, `ease ${struggling.ease}`);
check("a card that keeps failing keeps coming back", struggling.interval === 0);

console.log("\n--- scraped passes are treated differently from strong ones ---");
let scraped = newReview("a", day(0));
let confident = newReview("b", day(0));
for (let i = 0; i < 4; i++) {
  scraped = schedule(scraped, 71, day(i));
  confident = schedule(confident, 99, day(i));
}
console.log(`        scraped 71s -> interval ${scraped.interval}d, ease ${scraped.ease}`);
console.log(`        strong 99s  -> interval ${confident.interval}d, ease ${confident.ease}`);
check("a barely-passed card returns sooner than a mastered one",
  scraped.interval < confident.interval);

console.log("\n--- the due queue ---");
const cards = [
  { ...newReview("overdue", day(0)), attempts: 1, interval: 3, due: day(-2).toISOString() },
  { ...newReview("today", day(0)), attempts: 1, interval: 3, due: day(0).toISOString() },
  { ...newReview("later", day(0)), attempts: 1, interval: 3, due: day(5).toISOString() },
];
const ready = due(cards, day(0));
console.log("        due today:", ready.map((c) => c.id).join(", "));
check("only cards at or past their date are due", ready.length === 2);
check("the most overdue comes first", ready[0].id === "overdue");

console.log("\n--- session queue mixes reviews and new material ---");
const queue = buildQueue(cards, ["overdue", "today", "later", "fresh1", "fresh2"], 4, day(0));
console.log("        queue:", queue.map((c) => c.id).join(", "));
check("reviews are placed before new cards",
  queue[0].id === "overdue" && queue[1].id === "today");
check("new cards fill the remaining space", queue.length === 4);
check("a card not yet due is not pulled forward",
  !queue.slice(2).some((c) => c.id === "later"));

console.log("\n--- progress summary ---");
const mixed = [
  newReview("untouched", day(0)),
  { ...newReview("young", day(0)), attempts: 2, interval: 6, lastScore: 80 },
  { ...newReview("retained", day(0)), attempts: 9, interval: 45, lastScore: 94 },
];
const progress = summarise(mixed, day(0));
console.log("       ", JSON.stringify(progress));
check("fresh, learning and mature are counted apart",
  progress.fresh === 1 && progress.learning === 1 && progress.mature === 1);
check("the mean score ignores cards never attempted", progress.meanScore === 87);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
