// Synthesises voice-like audio whose F0 follows each Mandarin tone, runs the
// real detector over it, and checks the grader prefers the true tone.
import { trackPitch, scoreTones, tonesFromPinyin } from "./pitch.mjs";

const SR = 16000;

// Chao-letter pitch targets in semitones relative to a 120 Hz base.
const PATHS = {
  1: (t) => 4,
  2: (t) => -2 + 6 * t,
  3: (t) => -1 - 5 * Math.sin(Math.PI * Math.min(t / 0.7, 1)) + (t > 0.7 ? 8 * (t - 0.7) : 0),
  4: (t) => 5 - 10 * t,
  5: (t) => 0,
};

function syllable(tone, ms) {
  const n = Math.floor((ms / 1000) * SR);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const hz = 120 * Math.pow(2, PATHS[tone](t) / 12);
    phase += (2 * Math.PI * hz) / SR;
    // A few harmonics so autocorrelation sees a glottal-like waveform.
    out[i] =
      0.5 * Math.sin(phase) +
      0.25 * Math.sin(2 * phase) +
      0.12 * Math.sin(3 * phase) +
      0.06 * Math.sin(4 * phase);
  }
  return out;
}

function utterance(tones) {
  const parts = tones.map((t) => syllable(t, 380));
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Float32Array(total);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

let pass = 0;
let fail = 0;

console.log("--- single tones: does the true label win? ---");
for (const spoken of [1, 2, 3, 4, 5]) {
  const track = trackPitch(utterance([spoken]), SR);
  const scores = [1, 2, 3, 4, 5].map((t) => ({
    t,
    s: scoreTones(track.contour, [t])?.overall ?? -1,
  }));
  const best = scores.reduce((a, b) => (b.s > a.s ? b : a));
  const truth = scores.find((x) => x.t === spoken);
  // On a monosyllable, tone 1 and tone 5 are genuinely indistinguishable:
  // register is measured against the speaker's own median, and with one
  // syllable that median IS the syllable. Either flat reading counts.
  const flatPair = (a, b) => (a === 1 || a === 5) && (b === 1 || b === 5);
  const ok = best.t === spoken || flatPair(best.t, spoken);
  ok ? pass++ : fail++;
  console.log(
    `spoke tone ${spoken} @ ${track.medianHz}Hz  self=${truth.s}  best=tone ${best.t}(${best.s})  ${ok ? "PASS" : "FAIL"}  all=${scores.map((x) => `${x.t}:${x.s}`).join(" ")}`
  );
}

console.log("\n--- multi-syllable line: ni3 hao3 ---");
const t2 = trackPitch(utterance([3, 3]), SR);
const right = scoreTones(t2.contour, tonesFromPinyin("ni3 hao3"));
const wrong = scoreTones(t2.contour, tonesFromPinyin("ni1 hao4"));
console.log(`correct pinyin -> ${right.overall}`, right.perSyllable);
console.log(`wrong pinyin   -> ${wrong.overall}`);
right.overall > wrong.overall + 10 ? pass++ : fail++;

console.log("\n--- flat monotone speaker attempting rising tone ---");
const flat = trackPitch(utterance([1]), SR);
const asRising = scoreTones(flat.contour, [2])?.overall;
console.log(`flat voice scored against tone 2 -> ${asRising} (must be low)`);
asRising < 55 ? pass++ : fail++;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
