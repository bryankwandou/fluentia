/**
 * Exercises generated from the written syllabus.
 *
 * Everything a learner is asked here comes out of modules.ts. Nothing is
 * invented at runtime and no model is consulted: the question, the right
 * answer and the wrong answers are all drill lines that were authored, so a
 * marked answer can be traced back to a line somebody wrote. That is the whole
 * reason this file exists rather than a prompt asking a model for ten questions
 * about a unit — a generated question has no author and cannot be audited.
 *
 * The generator is deterministic. The same unit produces the same exercises in
 * the same order on every machine, which is what makes the set testable and
 * what lets two people compare the same quiz.
 */

import type { Drill, Module, Unit } from "./modules";

export type Exercise =
  | {
      kind: "choice";
      id: string;
      /** What the learner is shown. */
      prompt: string;
      /** Romanisation of the prompt, when the prompt is target-language text. */
      promptRoman: string;
      /** Which way round the question runs, so the UI can label it. */
      direction: "toGloss" | "toTarget" | "toRoman";
      options: string[];
      answer: string;
      /** The drill this came from, for scheduling. */
      target: string;
    }
  | {
      kind: "blank";
      id: string;
      /** The line with one token replaced by a gap. */
      prompt: string;
      promptRoman: string;
      gloss: string;
      answer: string;
      target: string;
    }
  | {
      kind: "build";
      id: string;
      /** The meaning; the learner assembles the line that carries it. */
      prompt: string;
      /** Shuffled tokens of the target line. */
      tokens: string[];
      answer: string;
      promptRoman: string;
      target: string;
    }
  | {
      kind: "speak";
      id: string;
      prompt: string;
      promptRoman: string;
      gloss: string;
      target: string;
    };

export type ExerciseKind = Exercise["kind"];

/** What a correct answer is worth, on the same 0-100 scale speech is graded on. */
export const FULL_MARK = 100;

/* --------------------------------------------------------------- language */

/**
 * The voice tag handed to the browser's speech synthesiser. Getting this wrong
 * is not cosmetic: a Mandarin line read by an English voice is read letter by
 * letter, which teaches a pronunciation that does not exist.
 */
export function speechLangFor(track: string) {
  const key = track.toLowerCase();
  if (key.includes("mandarin") || key.includes("chinese")) return "zh-CN";
  if (key.includes("cantonese")) return "zh-HK";
  if (key.includes("japanese")) return "ja-JP";
  if (key.includes("korean")) return "ko-KR";
  if (key.includes("vietnamese")) return "vi-VN";
  if (key.includes("spanish")) return "es-ES";
  if (key.includes("french")) return "fr-FR";
  if (key.includes("german")) return "de-DE";
  if (key.includes("arabic")) return "ar-SA";
  if (key.includes("indonesian")) return "id-ID";
  return "en-US";
}

/**
 * Whether the script writes words with spaces between them.
 *
 * Chinese and Japanese do not, so a line has to be broken into characters to
 * be reassembled. Splitting an English sentence the same way would ask a
 * learner to spell rather than to compose.
 */
function spaced(track: string) {
  const key = track.toLowerCase();
  return !(
    key.includes("mandarin") ||
    key.includes("chinese") ||
    key.includes("cantonese") ||
    key.includes("japanese")
  );
}

const PUNCTUATION = /[.,!?;:"'“”‘’，。？！、]/g;

export function tokenise(target: string, track: string) {
  if (spaced(track)) {
    return target.split(/\s+/).filter(Boolean);
  }
  // Punctuation is dropped rather than made into its own tile: nobody learns
  // anything from being asked where the full stop goes.
  return Array.from(target).filter(
    (char) => !/\s/.test(char) && !new RegExp(PUNCTUATION.source).test(char)
  );
}

/**
 * Put chosen tiles back together. The join has to match the script: a Chinese
 * line reassembled with spaces between the characters is not the line, and
 * an English one reassembled without them is not a sentence.
 */
export function assemble(tokens: string[], track: string) {
  return tokens.join(spaced(track) ? " " : "");
}

/** Comparison used to mark a typed answer. Case and stray punctuation only. */
export function normalise(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(PUNCTUATION, "")
    .replace(/\s+/g, " ");
}

/* ------------------------------------------------------------ determinism */

/** FNV-1a. Small, stable across engines, and enough to seed a shuffle. */
function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic shuffle: same input, same order, on every machine. */
function shuffle<T>(items: T[], seed: string) {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Three wrong answers drawn from lines the learner is actually studying.
 *
 * Distractors from the same unit are the hard ones, so they come first; the
 * rest of the module fills in when a unit is short. A distractor equal to the
 * answer would make two options correct, so equality is filtered before the
 * count is taken rather than after.
 */
function distractors(answer: string, pool: string[], seed: string, count = 3) {
  const unique: string[] = [];
  for (const entry of shuffle(pool, seed)) {
    if (entry === answer) continue;
    if (unique.includes(entry)) continue;
    unique.push(entry);
    if (unique.length === count) break;
  }
  return unique;
}

/* --------------------------------------------------------------- building */

type Pools = { glosses: string[]; targets: string[]; romans: string[] };

function poolsFor(unit: Unit, module: Module): Pools {
  // Same-unit lines first: a distractor from the unit under test is a real
  // choice, whereas one from six units away is usually eliminable on topic.
  const others = module.units.filter((entry) => entry.id !== unit.id);
  const ordered: Drill[] = [
    ...unit.drills,
    ...others.flatMap((entry) => entry.drills),
  ];

  return {
    glosses: ordered.map((drill) => drill.gloss),
    targets: ordered.map((drill) => drill.target),
    romans: ordered.map((drill) => drill.roman).filter(Boolean),
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The vocabulary item this line can be tested on.
 *
 * A gap is only worth setting when the removed token appears exactly once —
 * otherwise the learner sees two identical gaps and is asked to fill one, with
 * no way to say which. Lines carrying no unit vocabulary are left without a
 * gap exercise rather than having an arbitrary word cut out of them.
 */
function gapWord(drill: Drill, unit: Unit, track: string) {
  for (const word of unit.vocabulary) {
    if (!drill.target.includes(word)) continue;
    if (drill.target.split(word).length - 1 !== 1) continue;
    if (spaced(track)) {
      // In a spaced script the vocabulary entry has to stand as a whole word,
      // or "for" would be cut out of "before" and a learner who typed the
      // right thing would be marked wrong.
      const boundary = new RegExp(
        `(^|\\s)${escapeRegExp(word)}(\\s|[.,!?;:]|$)`
      );
      if (!boundary.test(drill.target)) continue;
    }
    return word;
  }
  return null;
}

/**
 * Build the exercise set for one unit.
 *
 * Every drill produces at least one question, and the shape rotates by
 * position so a learner is not asked fourteen questions of the same kind. The
 * rotation is by index rather than at random because a fixed set is one a
 * teacher can print, hand out, and mark against.
 */
export function buildExercises(unit: Unit, module: Module): Exercise[] {
  const pools = poolsFor(unit, module);
  const track = module.track;
  const out: Exercise[] = [];

  unit.drills.forEach((drill, index) => {
    const seed = `${unit.id}:${drill.target}`;
    const gap = gapWord(drill, unit, track);
    const tokens = tokenise(drill.target, track);

    // Recognition before production: the earlier shapes ask the learner to
    // pick the line out, the later ones ask them to produce it.
    const slot = index % 4;

    if (slot === 1) {
      out.push({
        kind: "choice",
        id: `${seed}#target`,
        prompt: drill.gloss,
        promptRoman: "",
        direction: "toTarget",
        options: shuffle(
          [drill.target, ...distractors(drill.target, pools.targets, `${seed}t`)],
          `${seed}to`
        ),
        answer: drill.target,
        target: drill.target,
      });
    } else if (slot === 2 && tokens.length >= 2) {
      out.push({
        kind: "build",
        id: `${seed}#build`,
        prompt: drill.gloss,
        promptRoman: drill.roman,
        tokens: shuffle(tokens, `${seed}b`),
        answer: drill.target,
        target: drill.target,
      });
    } else if (slot === 3 && gap) {
      out.push({
        kind: "blank",
        id: `${seed}#blank`,
        prompt: drill.target.replace(gap, "____"),
        promptRoman: drill.roman,
        gloss: drill.gloss,
        answer: gap,
        target: drill.target,
      });
    } else {
      out.push({
        kind: "choice",
        id: `${seed}#gloss`,
        prompt: drill.target,
        promptRoman: drill.roman,
        direction: "toGloss",
        options: shuffle(
          [drill.gloss, ...distractors(drill.gloss, pools.glosses, `${seed}g`)],
          `${seed}go`
        ),
        answer: drill.gloss,
        target: drill.target,
      });
    }

    // Romanisation is only tested where the syllabus carries it, and only for
    // scripts where reading it is a skill separate from reading the line.
    if (drill.roman && pools.romans.length >= 4 && index % 5 === 2) {
      out.push({
        kind: "choice",
        id: `${seed}#roman`,
        prompt: drill.target,
        promptRoman: "",
        direction: "toRoman",
        options: shuffle(
          [drill.roman, ...distractors(drill.roman, pools.romans, `${seed}r`)],
          `${seed}ro`
        ),
        answer: drill.roman,
        target: drill.target,
      });
    }

    // Every third line is also spoken. Recording all fourteen would turn a ten
    // minute quiz into a forty minute session and nobody would finish it.
    if (index % 3 === 0) {
      out.push({
        kind: "speak",
        id: `${seed}#speak`,
        prompt: drill.target,
        promptRoman: drill.roman,
        gloss: drill.gloss,
        target: drill.target,
      });
    }
  });

  return out;
}

/** Mark one answer. Returns 0-100 so it lands on the same scale as speech. */
export function mark(exercise: Exercise, given: string) {
  // A spoken line is marked by the grader, not here. Returning a pass for it
  // would hand out a mark nobody measured.
  if (exercise.kind === "speak") return 0;
  if (exercise.kind === "blank" || exercise.kind === "build") {
    return normalise(given) === normalise(exercise.answer) ? FULL_MARK : 0;
  }
  return given === exercise.answer ? FULL_MARK : 0;
}

/** Totals the module page shows before a quiz is opened. */
export function countExercises(module: Module) {
  return module.units.reduce(
    (sum, unit) => sum + buildExercises(unit, module).length,
    0
  );
}
