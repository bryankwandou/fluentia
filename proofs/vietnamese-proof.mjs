// Vietnamese has six tones and, unlike Mandarin, writes them itself — so the
// grader can read the target straight off the line without a parallel
// romanisation. This checks both halves: that the orthography is parsed
// correctly, and that a contour carrying one tone is not scored as another.
//
// Two of the pairs are close on purpose. huyền and nặng both fall low, sắc and
// ngã both rise, and what really separates each pair is glottal rather than
// tonal — a pitch track cannot see a glottal stop. Those cases are reported
// with the margin they actually achieve instead of being left out.
import { trackPitch, scoreTones, tonesFromVietnamese } from "./pitch.mjs";

const SR = 16000;

// Semitones around a 120 Hz base: each tone's register plus its movement.
const PATHS = {
  1: () => 0.5,
  2: (t) => -3 + (1.0 - 2.8 * t),
  3: (t) => 2 + (-2.2 + 5.2 * t),
  4: (t) => -1 + shape([0.4, -0.6, -1.5, -2.0, -1.9, -1.2, -0.2, 0.8], t),
  5: (t) => 1 + shape([-1.6, -1.5, -1.4, -1.0, 0.0, 1.2, 2.4, 3.2], t),
  6: (t) => -3.5 + (0.8 - 4.1 * t),
};

/** Linear interpolation through an eight-point contour. */
function shape(points, t) {
  const at = Math.min(t, 0.999) * (points.length - 1);
  const i = Math.floor(at);
  return points[i] + (points[i + 1] - points[i]) * (at - i);
}

function syllable(tone, ms) {
  const n = Math.floor((ms / 1000) * SR);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    phase += (2 * Math.PI * 120 * Math.pow(2, PATHS[tone](t) / 12)) / SR;
    out[i] =
      0.5 * Math.sin(phase) +
      0.25 * Math.sin(2 * phase) +
      0.12 * Math.sin(3 * phase) +
      0.06 * Math.sin(4 * phase);
  }
  return out;
}

function utterance(tones, ms = 380) {
  const parts = tones.map((t) => syllable(t, ms));
  const out = new Float32Array(parts.reduce((s, p) => s + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

console.log("--- reading tones off the writing system ---");
const parsed = [
  ["xin chào bạn", [1, 2, 6]],
  ["Bạn khỏe không", [6, 4, 1]],
  // ă, ơ and ư shape the vowel and carry no pitch. A parser that treats every
  // diacritic as a tone mark gets this line wrong in three places.
  ["đã ăn cơm chưa", [5, 1, 1, 1]],
  ["ma mà má mả mã mạ", [1, 2, 3, 4, 5, 6]],
];
for (const [text, expected] of parsed) {
  const got = tonesFromVietnamese(text);
  console.log(`   ${text.padEnd(20)} -> ${JSON.stringify(got)}`);
  check(`"${text}" parses correctly`, JSON.stringify(got) === JSON.stringify(expected));
}

console.log("\n--- all six tones over one speaker median ---");
const frame = [1, 2, 3, 4, 5, 6];
const track = trackPitch(utterance(frame), SR);
console.log(`median ${track.medianHz} Hz, ${track.contour.length} contour points\n`);

const scored = scoreTones(track.contour, frame, "vietnamese");
console.log(`spoken as written -> ${scored.overall}/100`);
for (const entry of scored.perSyllable) {
  console.log(`   tone ${entry.tone} ${entry.name.padEnd(8)} ${entry.score}`);
}
check("the true six-tone reading scores well", scored.overall >= 75);

// A mislabelled syllable moves the overall mark by only a sixth of the damage,
// so the syllable itself is what gets inspected.
function drop(spoken, wrong) {
  const at = frame.indexOf(spoken);
  const swapped = frame.map((t, i) => (i === at ? wrong : t));
  const bad = scoreTones(track.contour, swapped, "vietnamese");
  const truth = scored.perSyllable[at].score;
  const mislabelled = bad.perSyllable[at].score;
  console.log(
    `   ${scored.perSyllable[at].name} read as ${bad.perSyllable[at].name}: ` +
      `${truth} -> ${mislabelled} (${truth - mislabelled} lower)`
  );
  return truth - mislabelled;
}

console.log("\n--- tones that differ in direction ---");
for (const [spoken, wrong] of [[3, 2], [2, 3], [3, 6], [6, 3], [1, 3], [4, 1]]) {
  check(`tone ${spoken} is not mistaken for ${wrong}`, drop(spoken, wrong) >= 15);
}

console.log("\n--- the two pairs a pitch track cannot separate ---");
console.log("    (huyền/nặng differ by a final stop, sắc/ngã by a mid-syllable break)");
// These were the assertions that first failed, and they failed in the worst
// possible direction: swapping the label sometimes scored the *wrong* tone
// higher than the right one. The distinction is glottal, the measurement is
// pitch, and no amount of retuning the tables buys evidence that was never
// recorded. So the pair is scored against one shared contour and the report
// names the sibling it was not separated from. A flat zero here is the correct
// result: it says the grader declined to judge, rather than guessing.
for (const [spoken, wrong] of [[2, 6], [6, 2], [3, 5], [5, 3]]) {
  check(
    `tone ${spoken} and tone ${wrong} are scored as one`,
    drop(spoken, wrong) === 0
  );
}

for (const [tone, sibling] of [[2, "nặng"], [6, "huyền"], [3, "ngã"], [5, "sắc"]]) {
  const entry = scored.perSyllable[frame.indexOf(tone)];
  console.log(`   ${entry.name.padEnd(8)} reported as shared with ${JSON.stringify(entry.sharedWith)}`);
  check(
    `${entry.name} declares that ${sibling} went unjudged`,
    entry.sharedWith.length === 1 && entry.sharedWith[0] === sibling
  );
}

// The merge must not leak: a tone that stands alone should say so.
for (const tone of [1, 4]) {
  const entry = scored.perSyllable[frame.indexOf(tone)];
  check(`${entry.name} claims no shared verdict`, entry.sharedWith.length === 0);
}

console.log("\n--- a whole line labelled with the wrong tones ---");
const rotated = scoreTones(track.contour, [6, 1, 2, 3, 4, 5], "vietnamese");
console.log(`   rotated labels: ${rotated.overall}/100 against ${scored.overall}/100`);
check("a rotated labelling scores far below the truth", scored.overall - rotated.overall >= 20);

console.log("\n--- an unmarked line is read as level, not as missing ---");
const flatLine = tonesFromVietnamese("ba ba ba");
check("unmarked syllables come back as ngang", JSON.stringify(flatLine) === "[1,1,1]");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
