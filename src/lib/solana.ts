import { createHash } from "crypto";
import bs58 from "bs58";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

/** Circle's USDC mint on devnet. */
export const USDC_DEVNET_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export const RPC_URL =
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export function getConnection() {
  return new Connection(RPC_URL, "confirmed");
}

/**
 * The registrar wallet that countersigns credentials. Accepts either a 64-byte
 * base58 secret key or a 32-byte hex seed, since the two formats turn up in
 * different wallet exports.
 */
export function getRegistrar(): Keypair | null {
  const raw = process.env.SOLANA_REGISTRAR_KEY?.trim();
  if (!raw) return null;

  try {
    if (/^[0-9a-fA-F]{64}$/.test(raw)) {
      return Keypair.fromSeed(Uint8Array.from(Buffer.from(raw, "hex")));
    }
    if (raw.startsWith("[")) {
      return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
    }
    return Keypair.fromSecretKey(Uint8Array.from(bs58.decode(raw)));
  } catch {
    return null;
  }
}

export type CredentialClaim = {
  learner: string;
  track: string;
  level: string;
  score: number;
  transcript: string;
  issuedAt: string;
};

/** Deterministic fingerprint. The chain stores this, never the raw audio. */
export function fingerprint(claim: CredentialClaim) {
  const canonical = [
    claim.learner,
    claim.track,
    claim.level,
    claim.score.toFixed(2),
    createHash("sha256").update(claim.transcript).digest("hex").slice(0, 16),
    claim.issuedAt,
  ].join("|");
  return createHash("sha256").update(canonical).digest("hex");
}

export function explorerTx(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function explorerAddress(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=devnet`;
}

/**
 * Writes the credential fingerprint to devnet through the memo program. The
 * payload stays under the 566 byte memo ceiling so a single instruction is
 * enough; verification later only needs the signature and the claim.
 */
export async function anchorCredential(claim: CredentialClaim) {
  const registrar = getRegistrar();
  if (!registrar) {
    return {
      ok: false as const,
      reason: "Registrar key is not configured on this deployment.",
    };
  }

  const digest = fingerprint(claim);
  const payload = JSON.stringify({
    p: "fluentia.v1",
    l: claim.learner,
    t: claim.track,
    v: claim.level,
    s: claim.score,
    h: digest,
    d: claim.issuedAt,
  });

  const connection = getConnection();

  // The memo program treats every account handed to it as a required signer,
  // so the registrar is the only one listed. The learner's address travels in
  // the payload instead, which is enough for a verifier to match it.
  const tx = new Transaction().add(
    new TransactionInstruction({
      keys: [{ pubkey: registrar.publicKey, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(payload, "utf8"),
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = registrar.publicKey;
  tx.sign(registrar);

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  });
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed"
  );

  return {
    ok: true as const,
    signature,
    digest,
    registrar: registrar.publicKey.toBase58(),
    explorer: explorerTx(signature),
  };
}

export function isProbablyPubkey(value: string) {
  try {
    const key = new PublicKey(value);
    return PublicKey.isOnCurve(key.toBytes());
  } catch {
    return false;
  }
}
