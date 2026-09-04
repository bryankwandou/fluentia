/**
 * Marking a handwritten character.
 *
 * A stroke-order database would be the ideal grader, and there is no free one
 * that covers the characters this syllabus uses. So the grading here is done
 * against the character itself: the glyph is drawn to an off-screen canvas at
 * the same size as the writing box, both it and the learner's ink are reduced
 * to bitmaps, and the two are compared. No model is asked for an opinion, and
 * the same two bitmaps always produce the same mark on any machine, which is
 * the property that makes it checkable.
 *
 * Two quantities matter and they pull against each other:
 *
 *   accuracy — of the ink the learner laid down, how much of it landed on the
 *              character. Punishes writing in the wrong place.
 *   coverage — of the character, how much of it the ink reached. Punishes
 *              leaving strokes out.
 *
 * Either one alone is trivially gamed: filling the whole box scores full
 * coverage, and a single correct dot scores full accuracy. The mark is their
 * product, so both have to be earned.
 */

export type Mask = Uint8Array;

/** Bitmap of everything within `radius` pixels of a set pixel. */
export function dilate(mask: Mask, width: number, height: number, radius: number): Mask {
  if (radius <= 0) return mask.slice();
  const out = new Uint8Array(mask.length);
  // Separable: a horizontal pass then a vertical one gives the same square
  // neighbourhood as the naive double loop at a fraction of the work, which
  // matters because this runs on every submitted attempt in the browser.
  const mid = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    for (let x = 0; x < width; x += 1) {
      if (!mask[row + x]) continue;
      const from = Math.max(0, x - radius);
      const to = Math.min(width - 1, x + radius);
      for (let k = from; k <= to; k += 1) mid[row + k] = 1;
    }
  }

  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    for (let x = 0; x < width; x += 1) {
      if (!mid[row + x]) continue;
      const from = Math.max(0, y - radius);
      const to = Math.min(height - 1, y + radius);
      for (let k = from; k <= to; k += 1) out[k * width + x] = 1;
    }
  }

  return out;
}

export function count(mask: Mask) {
  let total = 0;
  for (let i = 0; i < mask.length; i += 1) if (mask[i]) total += 1;
  return total;
}

function overlap(a: Mask, b: Mask) {
  let total = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] && b[i]) total += 1;
  return total;
}

export type TraceResult = {
  score: number;
  /** Share of the learner's ink that fell on the character. */
  accuracy: number;
  /** Share of the character the learner's ink reached. */
  coverage: number;
};

/**
 * Compare a written attempt against the printed character.
 *
 * `tolerance` is how far off the printed stroke a pen may wander and still
 * count as on it, in pixels. Some slack is not generosity: a handwritten form
 * is not the printed one, and a grader that demanded pixel agreement would
 * fail every correct character written by a human hand.
 */
export function scoreTrace(
  glyph: Mask,
  ink: Mask,
  width: number,
  height: number,
  tolerance = 6
): TraceResult {
  const inkPixels = count(ink);
  const glyphPixels = count(glyph);

  // An untouched box, or a single tap, is not an attempt. Marking it against
  // the ratios would hand out a pass for one well-placed dot.
  if (glyphPixels === 0 || inkPixels < Math.max(40, glyphPixels * 0.05)) {
    return { score: 0, accuracy: 0, coverage: 0 };
  }

  const band = dilate(glyph, width, height, tolerance);
  const reach = dilate(ink, width, height, tolerance);

  const accuracy = overlap(ink, band) / inkPixels;
  const coverage = overlap(glyph, reach) / glyphPixels;

  return {
    score: Math.round(100 * accuracy * coverage),
    accuracy: Math.round(accuracy * 100) / 100,
    coverage: Math.round(coverage * 100) / 100,
  };
}

/** Which scripts are written by hand here. Tracing a Latin word teaches nothing. */
export function tracedScript(track: string) {
  const key = track.toLowerCase();
  return (
    key.includes("mandarin") ||
    key.includes("chinese") ||
    key.includes("cantonese") ||
    key.includes("japanese") ||
    key.includes("korean")
  );
}
