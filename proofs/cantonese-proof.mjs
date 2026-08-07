// Cantonese is the hard case: three of its six tones are level and differ only
// by register. This synthesises all six over a shared speaker median and checks
// the grader can still tell them apart.
import { trackPitch, scoreTones, tonesFromJyutping } from "./pitch.mjs";

const SR = 16000;

// Chao letters for the six tones, in semitones around a 120 Hz base.
const PATHS = {
  1: () => 5,
  2: (t) => 0.5 + 3.5 * t,
  3: () => 1,
  4: (t) => -3.5 - 2 * t,
  5: (t) => -3 + 3 * t,
  6: () => -1,
};

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
const check = (label, ok) => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
};

// Each tone is spoken inside the same six-tone frame so the speaker's median
// is realistic. Scoring one syllable in isolation would put its own pitch at
// the median by definition and erase the register information entirely.
console.log("--- all six tones, register measured against a shared median ---");
const frame = [1, 2, 3, 4, 5, 6];
const track = trackPitch(utterance(frame), SR);
console.log(`median ${track.medianHz} Hz, ${track.contour.length} contour points\n`);

const scored = scoreTones(track.contour, frame, "cantonese");
console.log(`spoken as written -> ${scored.overall}/100`);
for (const entry of scored.perSyllable) {
  console.log(`   tone ${entry.tone} ${entry.name.padEnd(12)} ${entry.score}`);
}
check("the true six-tone reading scores well", scored.overall >= 75);

// The level tones are the whole difficulty: 55, 33 and 22 have identical
// shapes, so anything that tells them apart is doing it on register alone.
// Mislabelling one syllable out of six moves the overall mark by only a
// sixth of the damage, so the syllable itself is what gets inspected.
console.log("\n--- level tones confused with each other ---");
for (const [spoken, wrong] of [[1, 6], [6, 1], [3, 1], [3, 6]]) {
  const at = frame.indexOf(spoken);
  const swapped = frame.map((t, i) => (i === at ? wrong : t));
  const bad = scoreTones(track.contour, swapped, "cantonese");
  const truth = scored.perSyllable[at].score;
  const mislabelled = bad.perSyllable[at].score;
  const drop = truth - mislabelled;
  console.log(
    `   syllable ${at + 1}: tone ${spoken} scores ${truth}, read as tone ${wrong} scores ${mislabelled} (${drop} lower)`
  );
  check(`level tone ${spoken} is not mistaken for ${wrong}`, drop >= 12);
}

console.log("\n--- contour tones swapped ---");
const reversed = scoreTones(track.contour, [4, 5, 6, 1, 2, 3], "cantonese");
console.log(`   rotated labels: ${reversed.overall}/100`);
check("a rotated labelling scores far below the truth", scored.overall - reversed.overall >= 20);

console.log("\n--- jyutping parsing ---");
const parsed = tonesFromJyutping("nei5 hou2 maa3");
console.log("   nei5 hou2 maa3 ->", parsed);
check("jyutping tone digits are read correctly", JSON.stringify(parsed) === "[5,2,3]");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
