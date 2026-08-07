// Proves the replay guard against real devnet: a fresh signature is clean,
// claiming it works once, and a second claim on the same signature is refused.
import { Connection, Keypair } from "@solana/web3.js";
import { markRedeemed, isRedeemed, redemptionAddress } from "./payments.mjs";

const RPC = process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
const raw = process.env.SOLANA_REGISTRAR_KEY?.trim();
if (!raw) {
  console.log("SOLANA_REGISTRAR_KEY missing");
  process.exit(1);
}

const registrar = /^[0-9a-fA-F]{64}$/.test(raw)
  ? Keypair.fromSeed(Uint8Array.from(Buffer.from(raw, "hex")))
  : Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));

const connection = new Connection(RPC, "confirmed");
// A stand-in for a funding signature. The guard never inspects it; it only has
// to be the same string on both attempts and unused before this run.
const signature = "ReplayProof" + Date.now().toString().padStart(21, "0");
const marker = await redemptionAddress(registrar.publicKey, signature);

console.log("registrar:", registrar.publicKey.toBase58());
console.log("test signature:", signature);
console.log("derived marker:", marker.toBase58());
const before = await connection.getBalance(registrar.publicKey);
console.log("balance before:", before, "lamports");

let pass = 0;
let fail = 0;
const check = (label, ok) => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
};

check("a signature never seen before reads as unredeemed",
  (await isRedeemed(connection, registrar.publicKey, signature)) === false);

const first = await markRedeemed(connection, registrar, signature);
console.log("        first claim ->", JSON.stringify(first));
check("the first claim is granted", first.ok === true);

check("the same signature now reads as redeemed",
  (await isRedeemed(connection, registrar.publicKey, signature)) === true);

const second = await markRedeemed(connection, registrar, signature);
console.log("        second claim ->", JSON.stringify(second));
check("a second claim on the same signature is refused",
  second.ok === false && second.reason === "replayed");

const other = "ReplayProofOther" + Date.now().toString().padStart(16, "0");
check("an unrelated signature is unaffected",
  (await isRedeemed(connection, registrar.publicKey, other)) === false);

const after = await connection.getBalance(registrar.publicKey);
console.log("\nbalance after:", after, "lamports");
console.log("cost of the two claims:", before - after, "lamports (no rent, fees only)");
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
