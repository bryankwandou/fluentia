# Fluentia — submission brief

**Language study that leaves a record.**

Live: https://fluentia.vercel.app · Source: https://github.com/VincentiusBryanKwandou/fluentia

---

## 1. The problem, stated without inflation

Two failures sit on top of each other in language education.

The first is grading that flatters. Consumer apps optimise for session count, so
they reward a mangled sentence the same way they reward a correct one. The
learner accumulates green marks and then discovers, in front of an actual
speaker, that none of it converted. The feedback loop was never honest enough to
correct anything.

The second is a credential nobody can check. Language schools and platforms
issue PDFs whose only backing is that the issuer still trades. When they fold —
and they do — years of study become an unverifiable line on a résumé. The person
who did the work absorbs the loss. Meanwhile the exams that *are* trusted (HSK,
JLPT, DELE) cost money, require a test centre, and run on a fixed calendar.

Nobody has connected honest continuous assessment to a portable record.

## 2. What Fluentia does

A learner picks a language and a rung, is handed a line, and speaks it. The
recording is transcribed, then scored on four separate axes — accuracy,
pronunciation, tone, fluency — with one concrete correction attached. Clearing a
level writes the result to Solana under the learner's own wallet.

The catalogue spans early-years sound play through HSK 6 and CEFR C2, with
twelve languages carrying a mapped exam-board syllabus and open tutoring beyond
that.

## 3. Why a ledger, specifically

This is the question that decides whether the crypto element is real or
decorative. The honest answer:

- **Portability outliving the issuer.** The record's value depends on a public
  ledger and a documented format, not on our continued existence. A database row
  cannot make that promise.
- **Verification without an account.** A recruiter with a signature reads the
  claim in a browser tab. No API key, no login, no request to us.
- **Micropayment economics.** A quarter-dollar charge per finished lesson is
  uneconomic on card rails and ordinary on Solana. That unlocks the pricing
  model, not just the credential.

What we deliberately did *not* do: no token, no points economy, no speculative
layer bolted onto education. The chain does two jobs and stops.

## 4. What actually runs today

| Capability | Status |
| --- | --- |
| Conversation tutor across 200+ languages | Working, Groq `llama-3.3-70b-versatile` |
| Speech transcription and four-axis grading | Working, Groq `whisper-large-v3-turbo` |
| Credential written to Solana devnet | Working, verified transaction below |
| Public verifier reading back off chain | Working, `/api/verify` |
| Catalogue with exam-board ladders | Working, 12 mapped tracks |
| USDC balance settlement | Specified and priced, not yet wired to a transfer |

**Proof.** A credential written by this build and readable by anyone:

```
Signature  2XP6wrinu8ZiacJmccWDWtyPLMvgJf6yEa4xtg9uaX9EqHbDXTDuEQbTqaBifC2CxkYE8jwMWnupfTPTtsZcyCt2
Registrar  C3otspAauyPNbAx9NA4wkH7P8hxhxhb1dyfqzhSmzaj9
Cluster    devnet
Record     {"p":"fluentia.v1","l":"5JTD…KWFfSk","t":"Mandarin Chinese",
            "v":"HSK 4","s":88.5,"h":"42f42ab0…","d":"2026-08-04T08:07:09.371Z"}
```

Explorer: https://explorer.solana.com/tx/2XP6wrinu8ZiacJmccWDWtyPLMvgJf6yEa4xtg9uaX9EqHbDXTDuEQbTqaBifC2CxkYE8jwMWnupfTPTtsZcyCt2?cluster=devnet

## 5. Business model canvas, condensed

**Segments.** Serious self-taught learners heading for a certification; parents
buying early-years exposure; language schools needing a roster and an export.

**Value proposition.** Grading honest enough to correct you, and a result that
does not evaporate when the vendor does.

**Revenue.** 0.25 USDC per completed lesson, or 12 USDC per seat per month for
cohorts. Revenue accrues on work performed rather than on forgotten renewals.

**Cost structure.** Inference is the dominant variable cost. A graded round is
one Whisper call plus one short completion; at Groq's throughput the unit
economics hold at the quoted price. Chain fees are 5,000 lamports per credential
and are rounding error.

**Channels.** Exam-prep communities, where the pain is specific and the
willingness to pay already demonstrated. Not general-purpose app-store
competition against Duolingo's marketing budget.

**Moat, honestly assessed.** Not the model — anyone can call Groq. The defensible
assets are the mapped syllabi, the grading rubric tuned per language family, and
the credential registry itself, which gains value with every issuer and verifier
that accepts it. That last one is a network effect and it is also the slowest to
build.

## 6. SWOT, without the padding

**Strengths.** A genuine wedge — nobody is pairing continuous honest assessment
with a portable record. The chain use is load-bearing rather than decorative. The
early-years position (no streaks, no leaderboards) is a real differentiator with
parents who have noticed what those mechanics do.

**Weaknesses.** Grading fidelity is capped by the underlying model; tone scoring
in particular is inferred from a transcript rather than from acoustic analysis,
which is a real limitation for Mandarin and Vietnamese. Twelve mapped ladders is
thin against a claim of 200+. USDC settlement is not yet wired.

**Opportunities.** Institutional issuance — a school signing its own credentials
against our registry — turns a consumer app into infrastructure. Employer-side
verification is the second half of that market.

**Threats.** Duolingo can ship an AI tutor and reach fifty million people the
same week. Incumbent exam boards have the trust we would need decades to build.
And "credential on chain" has been attempted enough times that the burden of
proof on adoption is entirely ours.

## 7. Where this goes next

1. Wire the USDC balance to real transfers, then move the registrar to mainnet.
2. Acoustic tone scoring rather than transcript inference, starting with Mandarin.
3. Institutional issuance: let a school sign credentials under its own key,
   verified against the same registry.
4. Expand mapped syllabi from twelve to the thirty languages that carry
   recognised exams.
