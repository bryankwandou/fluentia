/**
 * Client-side fundamental frequency tracking.
 *
 * Whisper throws pitch away — it returns characters, and by then the tone is
 * gone. Asking a text model to judge tone from a transcript is guesswork. So
 * the contour is measured here, from the raw samples, before the recording is
 * ever uploaded. What travels to the grader is a short numeric curve plus an
 * objective match score, and the model is told to use it rather than invent it.
 *
 * The detector is normalised autocorrelation (a trimmed ACF / McLeod hybrid),
 * which is cheap enough to run over a five second clip on a phone and accurate
 * enough for the 70-350 Hz band that human speech occupies.
 */

const MIN_HZ = 60;
const MAX_HZ = 500;
const FRAME_MS = 40;
const HOP_MS = 12;
/** Below this clarity the frame is unvoiced — silence, a consonant, or noise. */
const CLARITY_FLOOR = 0.86;

export type PitchTrack = {
  /** Semitone contour, normalised so the speaker's own median sits at zero. */
  contour: number[];
  /** Median F0 in Hz. Useful sanity signal: a 4 year old is not at 95 Hz. */
  medianHz: number;
  /** Share of frames that carried a voiced pitch, 0 to 1. */
  voicedRatio: number;
  /** Milliseconds of voiced speech. */
  voicedMs: number;
};

/** Detect F0 for one frame. Returns 0 when the frame is not voiced. */
function detectFrame(frame: Float32Array, sampleRate: number) {
  const size = frame.length;

  let power = 0;
  for (let i = 0; i < size; i++) power += frame[i] * frame[i];
  const rms = Math.sqrt(power / size);
  if (rms < 0.008) return { hz: 0, clarity: 0 };

  const minLag = Math.floor(sampleRate / MAX_HZ);
  const maxLag = Math.min(Math.floor(sampleRate / MIN_HZ), size - 1);

  let bestLag = -1;
  let bestScore = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    let energyA = 0;
    let energyB = 0;

    for (let i = 0; i < size - lag; i++) {
      correlation += frame[i] * frame[i + lag];
      energyA += frame[i] * frame[i];
      energyB += frame[i + lag] * frame[i + lag];
    }

    const denominator = Math.sqrt(energyA * energyB);
    if (denominator <= 0) continue;

    const score = correlation / denominator;
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  if (bestLag < 0 || bestScore < CLARITY_FLOOR) return { hz: 0, clarity: bestScore };

  // Parabolic interpolation around the peak so the estimate is not quantised
  // to whole samples, which matters a great deal at higher pitches.
  const refined = refineLag(frame, bestLag, sampleRate);
  return { hz: sampleRate / refined, clarity: bestScore };
}

function refineLag(frame: Float32Array, lag: number, sampleRate: number) {
  const at = (offset: number) => {
    let sum = 0;
    const shift = lag + offset;
    if (shift < 1 || shift >= frame.length) return -Infinity;
    for (let i = 0; i < frame.length - shift; i++) sum += frame[i] * frame[i + shift];
    return sum;
  };

  const left = at(-1);
  const centre = at(0);
  const right = at(1);
  if (!Number.isFinite(left) || !Number.isFinite(right)) return lag;

  const denominator = 2 * (2 * centre - left - right);
  if (denominator === 0) return lag;

  const adjustment = (right - left) / denominator;
  const refined = lag + adjustment;
  return refined > 0 && refined < sampleRate / MIN_HZ ? refined : lag;
}

/** Run the detector across a decoded mono buffer. */
export function trackPitch(samples: Float32Array, sampleRate: number): PitchTrack {
  const frameSize = Math.floor((FRAME_MS / 1000) * sampleRate);
  const hopSize = Math.floor((HOP_MS / 1000) * sampleRate);
  const readings: number[] = [];

  for (let start = 0; start + frameSize < samples.length; start += hopSize) {
    const { hz } = detectFrame(samples.subarray(start, start + frameSize), sampleRate);
    readings.push(hz);
  }

  const voiced = readings.filter((hz) => hz > 0);
  if (voiced.length < 4) {
    return { contour: [], medianHz: 0, voicedRatio: 0, voicedMs: 0 };
  }

  const medianHz = median(voiced);

  // Semitones relative to the speaker's own median. This is what makes the
  // measurement portable: a child and an adult producing the same rising tone
  // land on the same curve even though their absolute pitch differs by an
  // octave.
  const contour = voiced.map((hz) => 12 * Math.log2(hz / medianHz));

  return {
    // 96 points keeps the payload trivial while leaving at least four samples
    // per syllable on lines up to twenty-four syllables, which is the length
    // the HSK 5 and 6 drills actually reach. At 24 points the longer lines
    // silently fell through to no tone score at all.
    contour: resample(smooth(contour), 96).map((value) => round(value, 2)),
    medianHz: round(medianHz, 1),
    voicedRatio: round(voiced.length / readings.length, 3),
    voicedMs: voiced.length * HOP_MS,
  };
}

/** Decode a recorded blob to mono samples using the browser's own decoder. */
export async function analyseBlob(blob: Blob): Promise<PitchTrack | null> {
  if (typeof window === "undefined") return null;

  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  const context = new AudioCtx();
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const channel = buffer.getChannelData(0);
    return trackPitch(channel, buffer.sampleRate);
  } catch {
    return null;
  } finally {
    context.close().catch(() => undefined);
  }
}

/* ------------------------------------------------------------------ tones */

export type MandarinTone = 1 | 2 | 3 | 4 | 5;

/**
 * Idealised contours in semitones relative to the syllable's own mean, sampled
 * at eight points. Shapes follow the Chao tone letters: 55, 35, 214, 51, and a
 * neutral tone that carries no shape of its own.
 */
const TONE_SHAPES: Record<MandarinTone, number[]> = {
  1: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
  2: [-2.0, -1.6, -1.0, -0.2, 0.7, 1.6, 2.4, 3.0],
  3: [-0.5, -1.6, -2.6, -3.2, -3.0, -1.8, 0.2, 1.6],
  4: [3.4, 2.4, 1.2, -0.2, -1.6, -2.8, -3.6, -4.0],
  5: [0, 0, 0, 0, 0, 0, 0, 0],
};

export const TONE_NAMES: Record<MandarinTone, string> = {
  1: "high level",
  2: "rising",
  3: "dipping",
  4: "falling",
  5: "neutral",
};

/**
 * Compare a measured contour against the expected tone sequence and return a
 * score out of 100. Each syllable gets an equal slice of the voiced region,
 * which is coarse but holds up well for the short drilled lines this is used on.
 */
export function scoreTones(contour: number[], expected: MandarinTone[]) {
  if (contour.length < 8 || expected.length === 0) return null;

  const slice = Math.floor(contour.length / expected.length);
  if (slice < 4) return null;

  const perSyllable = expected.map((tone, index) => {
    const segment = contour.slice(index * slice, (index + 1) * slice);
    const raw = resample(segment, 8);
    const centred = centre(raw);
    const ideal = centre(TONE_SHAPES[tone]);
    const spread = Math.max(...centred) - Math.min(...centred);

    // Tones 1 and 5 carry no contour of their own — a high level tone and a
    // neutral tone are both judged on holding still. Comparing them by shape
    // would be comparing against a flat line, which correlates with nothing.
    // What separates them is register: tone 1 sits above the speaker's median,
    // a neutral tone sits at or below it.
    if (variance(ideal) < 1e-9) {
      const level = raw.reduce((sum, value) => sum + value, 0) / raw.length;
      const target = tone === 1 ? 2 : -1;
      const flatness = clamp(100 - spread * (tone === 5 ? 14 : 11));
      const register = clamp(100 - Math.abs(level - target) * 9);
      return { tone, score: clamp(flatness * 0.72 + register * 0.28) };
    }

    // Correlation captures the shape, error captures the depth. A learner who
    // rises in the right direction but far too weakly should not score full
    // marks, which is exactly what most apps let slide. A near-flat delivery
    // has no shape to correlate at all, so its shape credit is scaled down
    // toward neutral rather than being awarded on the strength of noise.
    const idealSpread = Math.max(...ideal) - Math.min(...ideal);
    const confidence = Math.min(1, spread / (idealSpread * 0.55));
    const shape = correlate(centred, ideal);
    const error = rootMeanSquare(centred.map((value, i) => value - ideal[i]));
    const shapeScore = ((shape + 1) / 2) * 100;
    const depthScore = clamp(100 - error * 11);
    const base = shapeScore * 0.62 + depthScore * 0.38;

    // A delivery with no contour at all gets no credit for accidentally
    // pointing the right way. As the movement approaches full depth the gate
    // opens and the measured score stands on its own.
    return { tone, score: clamp(40 + (base - 40) * confidence) };
  });

  const overall =
    perSyllable.reduce((sum, entry) => sum + entry.score, 0) / perSyllable.length;

  return {
    overall: Math.round(overall),
    perSyllable: perSyllable.map((entry) => ({
      tone: entry.tone,
      name: TONE_NAMES[entry.tone],
      score: Math.round(entry.score),
    })),
  };
}

/** Pull the tone digits out of numbered pinyin such as "ni3 hao3". */
export function tonesFromPinyin(text: string): MandarinTone[] {
  const matches = text.match(/[a-zü]+[1-5]/gi) ?? [];
  return matches
    .map((token) => Number(token.slice(-1)) as MandarinTone)
    .filter((tone) => tone >= 1 && tone <= 5);
}

/* ------------------------------------------------------------------- maths */

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/** Five point running median, which kills octave jumps without blurring slopes. */
function smooth(values: number[]) {
  return values.map((_, index) => {
    const window = values.slice(Math.max(0, index - 2), index + 3);
    return median(window);
  });
}

function resample(values: number[], length: number) {
  if (values.length === 0) return new Array(length).fill(0);
  if (values.length === length) return [...values];

  return Array.from({ length }, (_, index) => {
    const position = (index * (values.length - 1)) / (length - 1);
    const lower = Math.floor(position);
    const upper = Math.min(values.length - 1, lower + 1);
    const fraction = position - lower;
    return values[lower] * (1 - fraction) + values[upper] * fraction;
  });
}

function centre(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.map((value) => value - mean);
}

function correlate(a: number[], b: number[]) {
  const centredB = centre(b);
  let numerator = 0;
  let energyA = 0;
  let energyB = 0;

  for (let i = 0; i < a.length; i++) {
    numerator += a[i] * centredB[i];
    energyA += a[i] * a[i];
    energyB += centredB[i] * centredB[i];
  }

  const denominator = Math.sqrt(energyA * energyB);
  return denominator === 0 ? 0 : numerator / denominator;
}

function variance(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
}

function rootMeanSquare(values: number[]) {
  const sum = values.reduce((total, value) => total + value * value, 0);
  return Math.sqrt(sum / values.length);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function round(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
