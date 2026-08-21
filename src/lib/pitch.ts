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
export type ToneSystem = "mandarin" | "cantonese" | "vietnamese";

type ToneSpec = {
  name: string;
  /** Contour in semitones relative to the syllable's own mean. */
  shape: number[];
  /** Where the syllable sits relative to the speaker's median pitch. */
  level: number;
};

/**
 * Idealised contours in semitones, sampled at eight points. Mandarin shapes
 * follow the Chao tone letters: 55, 35, 214, 51, and a neutral tone that
 * carries no shape of its own.
 */
const MANDARIN: Record<number, ToneSpec> = {
  1: { name: "high level", shape: flat(), level: 2 },
  2: { name: "rising", shape: [-2.0, -1.6, -1.0, -0.2, 0.7, 1.6, 2.4, 3.0], level: 0.5 },
  3: { name: "dipping", shape: [-0.5, -1.6, -2.6, -3.2, -3.0, -1.8, 0.2, 1.6], level: -2 },
  4: { name: "falling", shape: [3.4, 2.4, 1.2, -0.2, -1.6, -2.8, -3.6, -4.0], level: 0 },
  5: { name: "neutral", shape: flat(), level: -1 },
};

/**
 * Cantonese, which is the harder case and the reason this is table-driven.
 * Three of its six tones are level — 55, 33 and 22 — and differ from each
 * other by nothing but register. A grader that centres each syllable before
 * comparing, as the Mandarin path does, cannot tell them apart at all. So
 * register is a first-class term here rather than a tiebreak for flat tones.
 */
const CANTONESE: Record<number, ToneSpec> = {
  1: { name: "high level", shape: flat(), level: 4 },
  2: { name: "high rising", shape: [-2.2, -1.8, -1.2, -0.4, 0.5, 1.4, 2.2, 2.8], level: 1.5 },
  3: { name: "mid level", shape: flat(), level: 0.5 },
  4: { name: "low falling", shape: [1.4, 0.9, 0.4, -0.1, -0.6, -1.1, -1.6, -2.0], level: -4 },
  5: { name: "low rising", shape: [-1.8, -1.4, -0.9, -0.3, 0.4, 1.0, 1.6, 2.0], level: -2 },
  6: { name: "low level", shape: flat(), level: -1.5 },
};

/**
 * Northern Vietnamese. Two pairs here are genuinely close: huyền and nặng both
 * fall into the low register, and sắc and ngã both rise out of the mid. What
 * separates each pair in speech is partly glottal — nặng is cut short by a stop
 * and ngã is broken in the middle — and a pitch track cannot see a glottal
 * closure, only the fall in energy around it. So they are told apart here on
 * depth and register, which works, and works less sharply than the pairs that
 * differ in direction. The proof reports both cases rather than only the
 * flattering one.
 */
const VIETNAMESE: Record<number, ToneSpec> = {
  1: { name: "ngang", shape: flat(), level: 0.5 },
  2: { name: "huyền", shape: [1.0, 0.6, 0.2, -0.2, -0.6, -1.0, -1.4, -1.8], level: -3 },
  3: { name: "sắc", shape: [-2.2, -1.8, -1.2, -0.4, 0.5, 1.4, 2.3, 3.0], level: 2 },
  4: { name: "hỏi", shape: [0.4, -0.6, -1.5, -2.0, -1.9, -1.2, -0.2, 0.8], level: -1 },
  5: { name: "ngã", shape: [-1.6, -1.5, -1.4, -1.0, 0.0, 1.2, 2.4, 3.2], level: 1 },
  6: { name: "nặng", shape: [0.8, 0.2, -0.5, -1.2, -1.9, -2.5, -3.0, -3.3], level: -3.5 },
};

const SYSTEMS: Record<ToneSystem, Record<number, ToneSpec>> = {
  mandarin: MANDARIN,
  cantonese: CANTONESE,
  vietnamese: VIETNAMESE,
};

/**
 * How much of the mark register carries. Mandarin tones are told apart by
 * their movement, so register is a light corrective there; Cantonese level
 * tones have nothing else to go on.
 */
const REGISTER_WEIGHT: Record<ToneSystem, number> = {
  mandarin: 0.16,
  cantonese: 0.45,
  // Vietnamese sits between the two: four of its six tones move, so shape
  // carries most of the mark, but the low pair and the rising pair are close
  // enough that register has to do more work than it does in Mandarin.
  vietnamese: 0.3,
};

/**
 * Points lost per semitone of register error. The slope has to match how
 * closely the language packs its levels: Mandarin's level tones sit three or
 * four semitones apart, Cantonese packs three of them into roughly five, so a
 * gentler Mandarin slope and a steeper Cantonese one are the same strictness
 * expressed in each language's own spacing.
 */
const REGISTER_SLOPE: Record<ToneSystem, number> = {
  mandarin: 9,
  cantonese: 14,
  vietnamese: 11,
};

/**
 * Tones this method cannot separate, and should not pretend to.
 *
 * Vietnamese huyền and nặng are both low falls; what tells them apart is the
 * glottal stop that cuts nặng short. sắc and ngã are both high rises; ngã is
 * broken in the middle by a glottal constriction. Neither cue is pitch, and a
 * pitch track is all this measures.
 *
 * Left alone, the tables scored a wrong label *higher* than the right one on
 * both pairs — the grader was handing out a confident number for a distinction
 * it had no evidence about, which is the exact failure this whole approach
 * exists to avoid. So the members of a pair are scored against one shared
 * contour: produce a good low fall and you are credited for a good low fall,
 * whichever of the two was asked for, and the report says which distinction
 * went unjudged instead of quietly inventing a verdict on it.
 *
 * Southern Vietnamese merges hỏi and ngã outright, so a learner being marked
 * identically on a pair they may not distinguish themselves is not a loss.
 */
const AMBIGUOUS: Partial<Record<ToneSystem, Record<number, number[]>>> = {
  vietnamese: {
    2: [2, 6],
    6: [2, 6],
    3: [3, 5],
    5: [3, 5],
  },
};

/**
 * The contour a tone is actually judged against. For an unambiguous tone that
 * is its own; for one of a merged pair it is the pair's mean, so both members
 * are held to the same target.
 */
function specFor(system: ToneSystem, tone: number): ToneSpec | undefined {
  const table = SYSTEMS[system];
  const own = table[tone];
  const group = AMBIGUOUS[system]?.[tone];
  if (!own || !group) return own;

  const members = group.map((member) => table[member]).filter(Boolean);
  const mean = (pick: (spec: ToneSpec) => number) =>
    members.reduce((sum, spec) => sum + pick(spec), 0) / members.length;

  return {
    name: own.name,
    level: mean((spec) => spec.level),
    shape: own.shape.map(
      (_, index) => mean((spec) => spec.shape[index])
    ),
  };
}

/** The other tones a given tone is scored identically to, by name. */
export function ambiguousWith(system: ToneSystem, tone: number) {
  const group = AMBIGUOUS[system]?.[tone];
  if (!group) return [];
  return group
    .filter((member) => member !== tone)
    .map((member) => SYSTEMS[system][member]?.name)
    .filter(Boolean) as string[];
}

export const TONE_NAMES: Record<MandarinTone, string> = {
  1: "high level",
  2: "rising",
  3: "dipping",
  4: "falling",
  5: "neutral",
};

export function toneCount(system: ToneSystem) {
  return Object.keys(SYSTEMS[system]).length;
}

function flat() {
  return [0, 0, 0, 0, 0, 0, 0, 0];
}

/**
 * Compare a measured contour against the expected tone sequence and return a
 * score out of 100. Each syllable gets an equal slice of the voiced region,
 * which is coarse but holds up well for the short drilled lines this is used on.
 */
export function scoreTones(
  contour: number[],
  expected: number[],
  system: ToneSystem = "mandarin"
) {
  if (contour.length < 8 || expected.length === 0) return null;

  // Register is measured against the speaker's own median, and on a single
  // syllable that median *is* the syllable — the level comes out at zero no
  // matter what was said. So register only carries information once there is
  // more than one syllable to compare against. Scoring it on a monosyllable
  // would be scoring noise, and it cost a correctly produced Mandarin third
  // tone two points against a wrong answer when it was first tried.
  const registerWeight = expected.length > 1 ? REGISTER_WEIGHT[system] : 0;
  const slice = Math.floor(contour.length / expected.length);
  if (slice < 4) return null;

  const perSyllable = expected.map((tone, index) => {
    const spec = specFor(system, tone);
    if (!spec) return { tone, name: "unknown", score: 0, sharedWith: [] as string[] };

    const segment = contour.slice(index * slice, (index + 1) * slice);
    const raw = resample(segment, 8);
    const centred = centre(raw);
    const ideal = centre(spec.shape);
    const spread = Math.max(...centred) - Math.min(...centred);

    // Register: where the syllable sits against the speaker's own median. This
    // is the only thing separating Cantonese 55, 33 and 22, and it is what
    // stops a Mandarin first tone being scored as a neutral one.
    const level = raw.reduce((sum, value) => sum + value, 0) / raw.length;
    const register = clamp(100 - Math.abs(level - spec.level) * REGISTER_SLOPE[system]);

    let contourScore: number;

    if (variance(ideal) < 1e-9) {
      // A level tone carries no shape, so it is judged on holding still.
      // Comparing it by correlation would be correlating against a flat line,
      // which matches anything.
      contourScore = clamp(100 - spread * 12);
    } else {
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
      contourScore = clamp(40 + (base - 40) * confidence);
    }

    return {
      tone,
      name: spec.name,
      score: clamp(contourScore * (1 - registerWeight) + register * registerWeight),
      sharedWith: ambiguousWith(system, tone),
    };
  });

  const overall =
    perSyllable.reduce((sum, entry) => sum + entry.score, 0) / perSyllable.length;

  return {
    overall: Math.round(overall),
    perSyllable: perSyllable.map((entry) => ({
      tone: entry.tone,
      name: entry.name,
      score: Math.round(entry.score),
      // Carried through to the learner so a mark on one of a merged pair is
      // never read as a verdict on the distinction the pitch track skipped.
      sharedWith: entry.sharedWith,
    })),
  };
}

/** Pull tone digits out of Jyutping such as "nei5 hou2". */
export function tonesFromJyutping(text: string) {
  const matches = text.match(/[a-z]+[1-6]/gi) ?? [];
  return matches
    .map((token) => Number(token.slice(-1)))
    .filter((tone) => tone >= 1 && tone <= 6);
}

/**
 * Read tones straight off Vietnamese text such as "xin chào bạn" -> [1, 2, 6].
 *
 * Vietnamese needs no parallel romanisation the way Mandarin does: the writing
 * system already marks tone, and each syllable is written as its own word. The
 * only trap is that a vowel can carry two diacritics at once — one for vowel
 * quality and one for tone, as in "ườ" — so the string is decomposed and only
 * the five tone marks are read. Breve, circumflex and horn shape the vowel and
 * say nothing about pitch, and are skipped.
 */
const TONE_MARKS: Record<string, number> = {
  "̀": 2, // grave, huyền
  "́": 3, // acute, sắc
  "̉": 4, // hook above, hỏi
  "̃": 5, // tilde, ngã
  "̣": 6, // dot below, nặng
};

export function tonesFromVietnamese(text: string) {
  return text
    .split(/\s+/)
    .filter((syllable) => /\p{Letter}/u.test(syllable))
    .map((syllable) => {
      for (const character of syllable.normalize("NFD")) {
        const tone = TONE_MARKS[character];
        if (tone) return tone;
      }
      // No mark at all is not missing data — it is ngang, the level tone.
      return 1;
    });
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
