// Asks the provider whether the models this app names still exist.
//
// This suite exists because of a failure that nothing else caught. The chat
// model was retired upstream while its name was still hard-coded here. Every
// tutor turn came back 404, and the speech route - which is built to survive an
// examiner outage - did exactly what it was designed to do and scored pitch
// alone. The degradation worked perfectly, which is precisely why the breakage
// went unnoticed: the product looked like it was running.
//
// A graceful fallback hides an outage as effectively as it survives one. So the
// question gets asked directly rather than inferred from whether requests still
// return something.
import { CHAT_MODEL, AUDIO_MODEL } from "./groq.mjs";

const key = process.env.GROQ_API_KEY;
if (!key) {
  console.log("GROQ_API_KEY is not set; run through `npm run test:all`.");
  process.exit(1);
}

let pass = 0;
let fail = 0;
const check = (label, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `\n        ${detail}` : ""}`);
};

const response = await fetch("https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${key}` },
});

if (!response.ok) {
  console.log(`the model list itself came back ${response.status} -> FAIL`);
  process.exit(1);
}

const available = new Set(((await response.json()).data ?? []).map((m) => m.id));
console.log(`the account can reach ${available.size} models\n`);

for (const [role, model] of [
  ["chat", CHAT_MODEL],
  ["audio", AUDIO_MODEL],
]) {
  check(`the ${role} model ${model} still exists`, available.has(model));
}

// Existing is not the same as working. A model can be listed and still refuse
// the shape this app depends on, so the chat model is asked for the JSON object
// the grader parses - the same contract, in miniature.
console.log("\n--- the chat model still returns parseable JSON ---");
const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
  body: JSON.stringify({
    model: CHAT_MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: 'Reply with JSON only, shaped {"score":0-100,"verdict":"one sentence"}',
      },
      { role: "user", content: "The learner read the target line back correctly." },
    ],
  }),
});

const body = await completion.json();
const text = body?.choices?.[0]?.message?.content ?? "";
let parsed = null;
try {
  parsed = JSON.parse(text);
} catch {
  parsed = null;
}

console.log(`   returned: ${text.slice(0, 120)}`);
check("the reply parses as JSON", parsed !== null, body?.error?.message ?? "");
check(
  "the reply carries a numeric score",
  typeof parsed?.score === "number" && parsed.score >= 0 && parsed.score <= 100
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
