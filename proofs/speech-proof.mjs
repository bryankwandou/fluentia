// Sends a synthesised utterance to the deployed grader twice — once labelled
// with the pinyin it actually carries, once with the wrong tones — to show the
// tone mark is measured from pitch rather than read off the transcript.
import { trackPitch } from "./pitch.mjs";

const BASE = process.argv[2] ?? "https://fluentia.vercel.app";
const SR = 16000;

const PATHS = {
  1: () => 4,
  2: (t) => -2 + 6 * t,
  3: (t) =>
    -1 - 5 * Math.sin(Math.PI * Math.min(t / 0.7, 1)) + (t > 0.7 ? 8 * (t - 0.7) : 0),
  4: (t) => 5 - 10 * t,
  5: () => 0,
};

function syllable(tone, ms) {
  const n = Math.floor((ms / 1000) * SR);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    phase += (2 * Math.PI * 120 * Math.pow(2, PATHS[tone](t) / 12)) / SR;
    const envelope = Math.min(1, t * 12, (1 - t) * 12);
    out[i] =
      envelope *
      (0.5 * Math.sin(phase) +
        0.25 * Math.sin(2 * phase) +
        0.12 * Math.sin(3 * phase) +
        0.06 * Math.sin(4 * phase));
  }
  return out;
}

function utterance(tones) {
  const parts = tones.map((t) => syllable(t, 400));
  const out = new Float32Array(parts.reduce((s, p) => s + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

function wav(samples) {
  const header = Buffer.alloc(44);
  const body = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    body.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32767, i * 2);
  }
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + body.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(body.length, 40);
  return Buffer.concat([header, body]);
}

const samples = utterance([3, 3]);
const track = trackPitch(samples, SR);
const audio = wav(samples);
console.log(
  `synthesised ni3 hao3: ${track.medianHz} Hz median, ${track.voicedMs} ms voiced, ${track.contour.length} contour points`
);

async function grade(label, expectedPinyin) {
  const form = new FormData();
  form.set("audio", new Blob([audio], { type: "audio/wav" }), "take.wav");
  form.set("track", "Mandarin Chinese");
  form.set("level", "HSK 1");
  form.set("prompt", "你好");
  form.set("expectedPinyin", expectedPinyin);
  form.set("contour", track.contour.join(","));
  form.set("medianHz", String(track.medianHz));
  form.set("voicedRatio", String(track.voicedRatio));
  form.set("voicedMs", String(track.voicedMs));

  // Keep-alive is refused deliberately. Node on Windows trips a libuv assertion
  // when process.exit lands while a pooled socket is still closing, and this
  // script makes two requests, so there is nothing to gain from reusing one.
  const response = await fetch(`${BASE}/api/speech`, {
    method: "POST",
    body: form,
    headers: { connection: "close" },
  });
  const data = await response.json();
  console.log(`\n--- ${label} (expectedPinyin: ${expectedPinyin}) ---`);
  if (data.error) {
    console.log("error:", data.error);
    return null;
  }
  // A quota-exhausted examiner is not a failed round. The tone figure is
  // arithmetic on the contour and owes the model nothing, so the route hands
  // it back on its own and the comparison below still means what it meant.
  if (data.degraded) console.log("degraded:", data.reason);
  console.log("transcript:", JSON.stringify(data.transcript));
  console.log(
    "tones:",
    data.tones
      ? `${data.tones.overall}/100  ${data.tones.perSyllable
          .map((s) => `${s.name}:${s.score}`)
          .join(" ")}`
      : "none"
  );
  console.log("grade:", JSON.stringify(data.grade));
  return data;
}

const right = await grade("labelled with the tones it really carries", "ni3 hao3");
const wrong = await grade("labelled with tones it does not carry", "ni1 hao4");

// exitCode rather than exit(): the loop is left to drain on its own so the
// status is reported after the sockets are gone, not on top of them.
if (right?.tones && wrong?.tones) {
  const gap = right.tones.overall - wrong.tones.overall;
  console.log(
    `\ntone mark moved ${gap} points on identical audio -> ${
      gap > 15 ? "PASS" : "FAIL"
    }`
  );

  let ok = gap > 15;

  // Two separate things are checked here, and for a while only the second one
  // was.
  //
  // The fallback has to hold: a degraded reply still has to carry a usable
  // mark, or it is an outage wearing better clothes. That much was already
  // asserted, and it passed - which is precisely how the examiner went missing
  // in production without a suite noticing. Every live round came back
  // degraded, every degraded round carried a tone score, and the proof called
  // it a pass.
  //
  // So degradation is now a failure in its own right. Against the live
  // deployment the examiner is supposed to answer; if it does not, the reason
  // is printed and the suite goes red whether the fallback behaved or not.
  for (const [label, data] of [["correct labelling", right], ["wrong labelling", wrong]]) {
    if (!data.degraded) {
      console.log(`examiner answered on ${label} -> PASS`);
      continue;
    }
    const usable = data.grade?.tone === data.tones.overall && data.grade.score > 0;
    console.log(
      `degraded ${label} still scored ${data.grade?.score} on tone alone -> ${
        usable ? "PASS" : "FAIL"
      }`
    );
    console.log(`examiner did not answer on ${label} -> FAIL  (${data.reason})`);
    ok = false;
  }

  process.exitCode = ok ? 0 : 1;
} else {
  console.log("\nthe grader returned no tone report -> FAIL");
  process.exitCode = 1;
}
