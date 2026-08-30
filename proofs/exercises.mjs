const FULL_MARK = 100;
function speechLangFor(track) {
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
function spaced(track) {
  const key = track.toLowerCase();
  return !(key.includes("mandarin") || key.includes("chinese") || key.includes("cantonese") || key.includes("japanese"));
}
const PUNCTUATION = /[.,!?;:"'“”‘’，。？！、]/g;
function tokenise(target, track) {
  if (spaced(track)) {
    return target.split(/\s+/).filter(Boolean);
  }
  return Array.from(target).filter(
    (char) => !/\s/.test(char) && !new RegExp(PUNCTUATION.source).test(char)
  );
}
function assemble(tokens, track) {
  return tokens.join(spaced(track) ? " " : "");
}
function normalise(value) {
  return value.trim().toLowerCase().replace(PUNCTUATION, "").replace(/\s+/g, " ");
}
function hash(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function shuffle(items, seed) {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = Math.imul(state, 1103515245) + 12345 >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function distractors(answer, pool, seed, count = 3) {
  const unique = [];
  for (const entry of shuffle(pool, seed)) {
    if (entry === answer) continue;
    if (unique.includes(entry)) continue;
    unique.push(entry);
    if (unique.length === count) break;
  }
  return unique;
}
function poolsFor(unit, module) {
  const others = module.units.filter((entry) => entry.id !== unit.id);
  const ordered = [
    ...unit.drills,
    ...others.flatMap((entry) => entry.drills)
  ];
  return {
    glosses: ordered.map((drill) => drill.gloss),
    targets: ordered.map((drill) => drill.target),
    romans: ordered.map((drill) => drill.roman).filter(Boolean)
  };
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function gapWord(drill, unit, track) {
  for (const word of unit.vocabulary) {
    if (!drill.target.includes(word)) continue;
    if (drill.target.split(word).length - 1 !== 1) continue;
    if (spaced(track)) {
      const boundary = new RegExp(
        `(^|\\s)${escapeRegExp(word)}(\\s|[.,!?;:]|$)`
      );
      if (!boundary.test(drill.target)) continue;
    }
    return word;
  }
  return null;
}
function buildExercises(unit, module) {
  const pools = poolsFor(unit, module);
  const track = module.track;
  const out = [];
  unit.drills.forEach((drill, index) => {
    const seed = `${unit.id}:${drill.target}`;
    const gap = gapWord(drill, unit, track);
    const tokens = tokenise(drill.target, track);
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
        target: drill.target
      });
    } else if (slot === 2 && tokens.length >= 2) {
      out.push({
        kind: "build",
        id: `${seed}#build`,
        prompt: drill.gloss,
        promptRoman: drill.roman,
        tokens: shuffle(tokens, `${seed}b`),
        answer: drill.target,
        target: drill.target
      });
    } else if (slot === 3 && gap) {
      out.push({
        kind: "blank",
        id: `${seed}#blank`,
        prompt: drill.target.replace(gap, "____"),
        promptRoman: drill.roman,
        gloss: drill.gloss,
        answer: gap,
        target: drill.target
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
        target: drill.target
      });
    }
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
        target: drill.target
      });
    }
    if (index % 3 === 0) {
      out.push({
        kind: "speak",
        id: `${seed}#speak`,
        prompt: drill.target,
        promptRoman: drill.roman,
        gloss: drill.gloss,
        target: drill.target
      });
    }
  });
  return out;
}
function mark(exercise, given) {
  if (exercise.kind === "speak") return 0;
  if (exercise.kind === "blank" || exercise.kind === "build") {
    return normalise(given) === normalise(exercise.answer) ? FULL_MARK : 0;
  }
  return given === exercise.answer ? FULL_MARK : 0;
}
function countExercises(module) {
  return module.units.reduce(
    (sum, unit) => sum + buildExercises(unit, module).length,
    0
  );
}
export {
  FULL_MARK,
  assemble,
  buildExercises,
  countExercises,
  mark,
  normalise,
  speechLangFor,
  tokenise
};
