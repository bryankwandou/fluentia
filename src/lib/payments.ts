import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  type TransactionSignature,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

/** Circle's USDC mint on devnet. Six decimals, same as mainnet. */
export const USDC_DEVNET_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export const USDC_DECIMALS = 6;

/** Where lesson funding lands. Same key that countersigns credentials. */
export const TREASURY = new PublicKey(
  process.env.NEXT_PUBLIC_TREASURY ??
    "C3otspAauyPNbAx9NA4wkH7P8hxhxhb1dyfqzhSmzaj9"
);

export const LESSON_PRICE_USDC = 0.25;

export function toBaseUnits(amount: number) {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
}

export function fromBaseUnits(amount: bigint | number) {
  return Number(amount) / 10 ** USDC_DECIMALS;
}

/**
 * Build an unsigned USDC transfer from the learner to the treasury.
 *
 * `createTransferCheckedInstruction` is used rather than the plain transfer so
 * the mint and decimals are asserted on chain. A malformed client cannot move
 * the wrong token by accident, and the verifier downstream can rely on it.
 */
export async function buildFundingTransaction({
  connection,
  payer,
  amount,
}: {
  connection: Connection;
  payer: PublicKey;
  amount: number;
}) {
  const source = await getAssociatedTokenAddress(USDC_DEVNET_MINT, payer);
  const destination = await getAssociatedTokenAddress(
    USDC_DEVNET_MINT,
    TREASURY,
    true
  );

  const transaction = new Transaction();

  // The learner must already hold devnet USDC; we cannot conjure it. The
  // treasury side, however, may legitimately not exist yet on a fresh cluster,
  // so the payer creates it and absorbs the rent.
  let destinationExists = true;
  try {
    await getAccount(connection, destination);
  } catch {
    destinationExists = false;
  }

  if (!destinationExists) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        destination,
        TREASURY,
        USDC_DEVNET_MINT
      )
    );
  }

  transaction.add(
    createTransferCheckedInstruction(
      source,
      USDC_DEVNET_MINT,
      destination,
      payer,
      toBaseUnits(amount),
      USDC_DECIMALS,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;

  return { transaction, blockhash, lastValidBlockHeight, source, destination };
}

/** Read a learner's devnet USDC balance. Returns null when they hold none. */
export async function readUsdcBalance(connection: Connection, owner: PublicKey) {
  try {
    const address = await getAssociatedTokenAddress(USDC_DEVNET_MINT, owner);
    const account = await getAccount(connection, address);
    return fromBaseUnits(account.amount);
  } catch {
    return null;
  }
}

/* -------------------------------------------------------- replay guard */

/**
 * A funding signature must only ever buy lessons once.
 *
 * There is no database here, and adding one for a single boolean would be the
 * wrong trade. The chain keeps the ledger instead: each redemption derives a
 * marker address deterministically from the funding signature and sends a
 * zero-lamport transfer that names it. The marker account is never created and
 * never holds rent — it only has to be *referenced*, because the cluster
 * indexes every address a transaction touches. Asking whether a signature was
 * spent is then one `getSignaturesForAddress` call.
 *
 * The earlier version of this created a rent-exempt account, which is atomic
 * but costs 0.00089 SOL a time. On a registrar funded with less than a
 * hundredth of a SOL that buys exactly zero redemptions, so the marker is a
 * reference rather than an allocation and costs only the 5000 lamport fee.
 *
 * Two concurrent requests can both find the marker clean and both write it.
 * That race is settled afterward rather than prevented: whichever transaction
 * the cluster ordered first owns the redemption, and the loser is told it is a
 * replay. Slot order is decided by the chain, so both servers reach the same
 * verdict independently.
 *
 * The seed is capped at 32 bytes by `createWithSeed`, so it carries the first
 * 32 characters of the base58 signature. That is roughly 187 bits of the
 * original 512, which leaves collisions far outside the range of anything an
 * attacker can search for.
 */
export function redemptionAddress(registrar: PublicKey, signature: string) {
  return PublicKey.createWithSeed(
    registrar,
    signature.slice(0, 32),
    SystemProgram.programId
  );
}

async function markerHistory(connection: Connection, marker: PublicKey) {
  // Newest first, which is the order the RPC returns.
  return connection.getSignaturesForAddress(marker, { limit: 20 }, "confirmed");
}

export async function isRedeemed(
  connection: Connection,
  registrar: PublicKey,
  signature: string
) {
  const marker = await redemptionAddress(registrar, signature);
  return (await markerHistory(connection, marker)).length > 0;
}

/**
 * Claim a funding signature. Returns `replayed` when someone else's claim on
 * the same marker landed first.
 */
export async function markRedeemed(
  connection: Connection,
  registrar: Keypair,
  signature: string
) {
  const marker = await redemptionAddress(registrar.publicKey, signature);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: registrar.publicKey,
      toPubkey: marker,
      lamports: 0,
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = registrar.publicKey;
  transaction.sign(registrar);

  const claim = await connection.sendRawTransaction(transaction.serialize(), {
    maxRetries: 3,
  });
  await connection.confirmTransaction(
    { signature: claim, blockhash, lastValidBlockHeight },
    "confirmed"
  );

  // Whoever the cluster ordered first holds the redemption. Reading the tail of
  // the marker's history rather than trusting our own write is what makes two
  // servers agree.
  const history = await markerHistory(connection, marker);
  const earliest = history[history.length - 1];

  if (!earliest || earliest.signature !== claim) {
    return { ok: false as const, reason: "replayed" as const };
  }

  return { ok: true as const, marker: marker.toBase58(), claim };
}

export type SettlementCheck =
  | { ok: true; amount: number; from: string; slot: number }
  | { ok: false; reason: string };

/**
 * Confirm on chain that a funding transaction really moved USDC to the
 * treasury. The client is never trusted for this: it hands over a signature,
 * and the balance deltas recorded by the cluster decide the answer.
 */
export async function verifySettlement(
  connection: Connection,
  signature: TransactionSignature,
  minimum: number
): Promise<SettlementCheck> {
  const tx = await connection.getTransaction(signature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  if (!tx) return { ok: false, reason: "Devnet has no transaction under that signature." };
  if (tx.meta?.err) return { ok: false, reason: "That transaction failed on chain." };

  const treasury = (
    await getAssociatedTokenAddress(USDC_DEVNET_MINT, TREASURY, true)
  ).toBase58();

  const before = tx.meta?.preTokenBalances ?? [];
  const after = tx.meta?.postTokenBalances ?? [];
  const accountKeys = tx.transaction.message
    .getAccountKeys()
    .staticAccountKeys.map((key) => key.toBase58());

  const findFor = (entries: typeof before, address: string) =>
    entries.find(
      (entry) =>
        accountKeys[entry.accountIndex] === address &&
        entry.mint === USDC_DEVNET_MINT.toBase58()
    );

  const openingBalance = Number(findFor(before, treasury)?.uiTokenAmount.uiAmount ?? 0);
  const closingBalance = Number(findFor(after, treasury)?.uiTokenAmount.uiAmount ?? 0);
  const credited = closingBalance - openingBalance;

  if (credited + 1e-9 < minimum) {
    return {
      ok: false,
      reason: `The treasury received ${credited.toFixed(4)} USDC, below the ${minimum} required.`,
    };
  }

  const payer = accountKeys[0] ?? "unknown";

  return { ok: true, amount: credited, from: payer, slot: tx.slot };
}
