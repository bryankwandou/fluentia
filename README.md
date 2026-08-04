# Fluentia

Language study that leaves a record.

Fluentia is a speaking tutor that marks learners the way an examiner would,
across more than two hundred languages — from a four-year-old copying sounds
through to an adult sitting HSK 6. Clearing a level writes the result to Solana
under the learner's own wallet, so the credential keeps its meaning after the
app is gone.

Live build: https://fluentia.vercel.app

---

## The two problems it answers

**Soft grading wastes years.** An app that congratulates a mangled sentence is
pleasant and useless. Every recording here is scored on four separate axes —
accuracy, pronunciation, tone, fluency — and a weak attempt is told it was
weak, with the single correction most worth making.

**A certificate is only worth the company behind it.** Schools close and apps
sunset, and the PDF becomes a claim nobody can check. Fluentia publishes the
result instead of storing it.

---

## What runs on chain

Passing a level produces one memo instruction on Solana devnet, signed by the
registrar wallet:

```json
{
  "p": "fluentia.v1",
  "l": "<learner wallet>",
  "t": "Mandarin Chinese",
  "v": "HSK 4",
  "s": 88.5,
  "h": "<sha256 of the graded transcript>",
  "d": "2026-08-04T08:07:09.371Z"
}
```

No audio and no personal detail leave the grader. The hash proves a specific
attempt without publishing what was said.

A verified write from this build:

- Signature `2XP6wrinu8ZiacJmccWDWtyPLMvgJf6yEa4xtg9uaX9EqHbDXTDuEQbTqaBifC2CxkYE8jwMWnupfTPTtsZcyCt2`
- [Open in Solana Explorer](https://explorer.solana.com/tx/2XP6wrinu8ZiacJmccWDWtyPLMvgJf6yEa4xtg9uaX9EqHbDXTDuEQbTqaBifC2CxkYE8jwMWnupfTPTtsZcyCt2?cluster=devnet)
- Registrar `C3otspAauyPNbAx9NA4wkH7P8hxhxhb1dyfqzhSmzaj9`

Read it back without an account:

```
GET /api/verify?signature=<signature>
```

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| App | Next.js 16, React 19, Tailwind 4 | Route handlers keep API keys server side |
| Conversation | Groq, `llama-3.3-70b-versatile` | Fast enough that a spoken exchange does not stall |
| Speech | Groq, `whisper-large-v3-turbo` | Transcribes the attempt before it is graded |
| Chain | Solana devnet, SPL Memo | One instruction, no program deploy, readable by any client |
| Motion | Framer Motion | Section entrances and score animation |

---

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the three values
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Drives both the tutor and the grader |
| `SOLANA_REGISTRAR_KEY` | Signs credentials. Hex seed, base58 secret key, or JSON byte array. Needs devnet SOL for fees |
| `SOLANA_RPC_URL` | Defaults to the public devnet endpoint |

---

## Routes

| Path | What it does |
| --- | --- |
| `/` | Landing page with a working tone lab |
| `/catalogue` | Twelve mapped ladders plus the long tail |
| `/catalogue/[slug]` | Every rung of one language, with word counts and study hours |
| `/tutor` | The console: conversation, recording, grading, anchoring |
| `/credentials` | What goes on chain, and a verifier anyone can use |
| `/kids` | The early-years position |
| `/pricing` | Per-lesson USDC settlement |
| `/manifesto` | The argument behind the product |

| API | Method | Purpose |
| --- | --- | --- |
| `/api/tutor` | POST | One conversation turn |
| `/api/speech` | POST | Transcribe and grade a recording |
| `/api/credential` | GET / POST | Registrar status, and writing a credential |
| `/api/verify` | GET | Read a credential back off devnet |

---

## Known limits

- Devnet only. Nothing here settles real money.
- The USDC balance flow is specified and priced but not yet wired to a token
  transfer. Credential anchoring is the part that runs end to end today.
- Twelve languages carry a mapped syllabus. The rest are tutored without a
  certification ladder attached.
- Grading quality tracks the underlying model. It is sharper than a streak
  counter, and it is not a human examiner.
