import {
  Connection,
  PublicKey,
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
