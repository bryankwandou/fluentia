/**
 * The handwriting mark, checked without a browser.
 *
 * The grader takes two bitmaps and returns a number. That is deliberate: it
 * means the marking can be run here, on synthetic ink, and the answers checked
 * against what a person would say about the same picture. The cases below are
 * the ones a learner would try if they wanted a mark they had not earned —
 * an empty box, a single dot, a filled square, a character written in the
 * wrong place — plus the ones a person writing honestly would produce.
 */

import { scoreTrace, dilate, count, tracedScript } from "./tracing.mjs";

const W = 120;
const H = 120;

let passes = 0;
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) {
    passes += 1;
    console.log(`PASS  ${label}${detail ? `  [${detail}]` : ""}`);
  } else {
    failures += 1;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function blank() {
  return new Uint8Array(W * H);
}

/** A filled rectangle, the building block every shape here is made of. */
function box(mask, x0, y0, x1, y1) {
  // Rounded, because a stroke of odd thickness lands on half pixels and a
  // fractional index writes to a property of the array rather than into it.
  const top = Math.max(0, Math.round(y0));
  const bottom = Math.min(H - 1, Math.round(y1));
  const left = Math.max(0, Math.round(x0));
  const right = Math.min(W - 1, Math.round(x1));
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      mask[y * W + x] = 1;
    }
  }
  return mask;
}

/** Stands in for a character: a cross, two strokes, like 十. */
function cross(offsetX = 0, offsetY = 0, thickness = 4) {
  const mask = blank();
  box(mask, 20 + offsetX, 58 + offsetY - thickness / 2, 100 + offsetX, 58 + offsetY + thickness / 2);
  box(mask, 58 + offsetX - thickness / 2, 20 + offsetY, 58 + offsetX + thickness / 2, 100 + offsetY);
  return mask;
}

console.log("\n--- the shape of the neighbourhood ---");

const dot = box(blank(), 60, 60, 60, 60);
check("a dot on its own covers one pixel", count(dot) === 1);
// A square neighbourhood of radius r around one pixel is (2r+1)^2.
check("dilating by 3 grows it to its neighbourhood", count(dilate(dot, W, H, 3)) === 49,
  `${count(dilate(dot, W, H, 3))} pixels`);
check("dilating by nothing changes nothing", count(dilate(dot, W, H, 0)) === 1);

console.log("\n--- what should score, and what should not ---");

const glyph = cross();

const empty = blank();
check("an empty box scores nothing", scoreTrace(glyph, empty, W, H).score === 0);

const singleDot = box(blank(), 58, 58, 60, 60);
check(
  "one dot in the right place is not a written character",
  scoreTrace(glyph, singleDot, W, H).score === 0,
  "too little ink to be an attempt"
);

// Filling the box reaches every stroke, so coverage is perfect. It is the
// accuracy half that has to catch this, and it is the case that decides
// whether the mark can be gamed at all.
const filled = box(blank(), 10, 10, 110, 110);
const scribble = scoreTrace(glyph, filled, W, H);
check("filling the whole box fails", scribble.score < 40, `scored ${scribble.score}`);
check("filling the box does reach the whole character", scribble.coverage > 0.95);
check("filling the box is mostly off the character", scribble.accuracy < 0.5,
  `accuracy ${scribble.accuracy}`);

// The right character in the wrong half of the box. Coverage collapses,
// because none of the ink is anywhere near the printed strokes.
const displaced = cross(38, 0);
const wrongPlace = scoreTrace(glyph, displaced, W, H);
check("the right shape in the wrong place fails", wrongPlace.score < 55,
  `scored ${wrongPlace.score}`);

// One of the two strokes written, the other left out.
const halfWritten = box(blank(), 20, 56, 100, 60);
const partial = scoreTrace(glyph, halfWritten, W, H);
check("a missing stroke costs coverage", partial.coverage < 0.75,
  `coverage ${partial.coverage}`);
check("a missing stroke does not fail on accuracy", partial.accuracy > 0.9,
  `accuracy ${partial.accuracy}`);
check("half a character does not pass", partial.score < 70, `scored ${partial.score}`);

console.log("\n--- a character written by hand ---");

// Not the printed form: thicker, and every stroke a few pixels off, which is
// what a human hand produces and what the grader has to accept.
const byHand = cross(2, -1, 7);
const honest = scoreTrace(glyph, byHand, W, H);
check("a wobbly but correct character passes", honest.score >= 70, `scored ${honest.score}`);
check("tracing the printed form exactly scores full marks",
  scoreTrace(glyph, glyph, W, H).score === 100);

console.log("\n--- the mark is repeatable ---");

check(
  "the same two bitmaps always give the same mark",
  scoreTrace(glyph, byHand, W, H).score === scoreTrace(glyph, byHand, W, H).score
);

console.log("\n--- which scripts are written by hand ---");

check("Mandarin is written", tracedScript("mandarin"));
check("Japanese is written", tracedScript("japanese"));
check("English is not traced", !tracedScript("english"));
check("Spanish is not traced", !tracedScript("spanish"));

console.log(`\n${passes} passed, ${failures} failed\n`);
process.exit(failures === 0 ? 0 : 1);
