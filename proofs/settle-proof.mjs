// Drives verifySettlement with real-shaped devnet transaction metadata to prove
// the credit is read from balance deltas rather than from anything a client says.
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  verifySettlement,
  USDC_DEVNET_MINT,
  TREASURY,
  LESSON_PRICE_USDC,
} from "./payments.mjs";

const treasuryAta = await getAssociatedTokenAddress(USDC_DEVNET_MINT, TREASURY, true);
const learner = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
const learnerAta = await getAssociatedTokenAddress(USDC_DEVNET_MINT, learner);
const OTHER_MINT = "So11111111111111111111111111111111111111112";

function tx({ pre, post, err = null, mint = USDC_DEVNET_MINT.toBase58() }) {
  const keys = [learner.toBase58(), learnerAta.toBase58(), treasuryAta.toBase58()];
  const bal = (index, amount) => ({
    accountIndex: index,
    mint,
    uiTokenAmount: { uiAmount: amount, decimals: 6, amount: String(amount * 1e6) },
  });
  return {
    slot: 402_113_887,
    meta: {
      err,
      preTokenBalances: [bal(1, pre.learner), bal(2, pre.treasury)],
      postTokenBalances: [bal(1, post.learner), bal(2, post.treasury)],
    },
    transaction: {
      message: {
        getAccountKeys: () => ({ staticAccountKeys: keys.map((k) => new PublicKey(k)) }),
      },
    },
  };
}

const stub = (returned) => ({ getTransaction: async () => returned });

const cases = [
  {
    name: "2.50 USDC really moved -> credited, 10 lessons",
    tx: tx({ pre: { learner: 10, treasury: 4 }, post: { learner: 7.5, treasury: 6.5 } }),
    expect: (r) => r.ok && Math.abs(r.amount - 2.5) < 1e-9,
  },
  {
    name: "exactly one lesson at 0.25 -> credited",
    tx: tx({ pre: { learner: 1, treasury: 0 }, post: { learner: 0.75, treasury: 0.25 } }),
    expect: (r) => r.ok && Math.abs(r.amount - 0.25) < 1e-9,
  },
  {
    name: "0.10 USDC, under the lesson price -> refused",
    tx: tx({ pre: { learner: 1, treasury: 0 }, post: { learner: 0.9, treasury: 0.1 } }),
    expect: (r) => !r.ok,
  },
  {
    name: "treasury balance unchanged (paid someone else) -> refused",
    tx: tx({ pre: { learner: 10, treasury: 4 }, post: { learner: 7.5, treasury: 4 } }),
    expect: (r) => !r.ok,
  },
  {
    name: "right amount but wrong mint -> refused",
    tx: tx({
      pre: { learner: 10, treasury: 0 },
      post: { learner: 7.5, treasury: 2.5 },
      mint: OTHER_MINT,
    }),
    expect: (r) => !r.ok,
  },
  {
    name: "transaction failed on chain -> refused",
    tx: tx({
      pre: { learner: 10, treasury: 4 },
      post: { learner: 7.5, treasury: 6.5 },
      err: { InstructionError: [0, "Custom"] },
    }),
    expect: (r) => !r.ok,
  },
  {
    name: "signature not on devnet -> refused",
    tx: null,
    expect: (r) => !r.ok,
  },
];

let pass = 0;
let fail = 0;
for (const item of cases) {
  const result = await verifySettlement(stub(item.tx), "sig", LESSON_PRICE_USDC);
  const ok = item.expect(result);
  ok ? pass++ : fail++;
  const detail = result.ok
    ? `credited ${result.amount} USDC -> ${Math.floor(result.amount / LESSON_PRICE_USDC)} lessons`
    : result.reason;
  console.log(`${ok ? "PASS" : "FAIL"}  ${item.name}\n        ${detail}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log(`treasury token account: ${treasuryAta.toBase58()}`);
process.exit(fail ? 1 : 0);
