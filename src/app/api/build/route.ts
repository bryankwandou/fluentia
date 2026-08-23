import { NextResponse } from "next/server";
import { AUDIO_MODEL, CHAT_MODEL } from "@/lib/groq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Says which commit is actually serving this URL.
 *
 * `vercel deploy --prod` gives a deployment its own hostname and aliases it to
 * one generated name; it does not touch fluentia.vercel.app, which is the
 * address the proofs check and the address a reader is given. Those two drifted
 * apart, and the live suite spent a run auditing code that had not been shipped
 * there - reporting an examiner outage that the deployed commit had already
 * fixed, and passing links against pages built from older content.
 *
 * A URL that cannot say what it is running cannot be audited, so it says. The
 * model names ride along because a retirement and a stale alias produce the
 * same symptom and are worth telling apart at a glance.
 */
export function GET() {
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
    deployedAt: process.env.VERCEL_DEPLOYMENT_ID ?? "local",
    chatModel: CHAT_MODEL,
    audioModel: AUDIO_MODEL,
  });
}
