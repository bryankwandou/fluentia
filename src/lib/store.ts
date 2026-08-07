"use client";

import { useCallback, useEffect, useState } from "react";
import { type Review, newReview, schedule, summarise } from "./srs";

/**
 * Learner state lives in the browser.
 *
 * Nothing here is worth a server: the review history is only useful to the
 * person who made it, and keeping it locally means there is no account to
 * create before the first lesson and no profile to leak. The credential on
 * devnet is the part that needs to be public and permanent, and that is
 * already anchored elsewhere.
 */
const KEY = "fluentia.reviews.v1";

function read(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Review[]) : [];
  } catch {
    // A corrupted store is not worth an error state; the learner loses their
    // schedule, which the next few attempts will rebuild.
    return [];
  }
}

function write(reviews: Review[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(reviews));
  } catch {
    // Quota or private mode. Practice still works, it just will not be
    // remembered, and saying so mid-lesson would help nobody.
  }
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReviews(read());
    setReady(true);
  }, []);

  /** Record an attempt and advance the card's schedule. */
  const record = useCallback((id: string, score: number) => {
    setReviews((current) => {
      const existing = current.find((review) => review.id === id);
      const advanced = schedule(existing ?? newReview(id), score);
      const next = existing
        ? current.map((review) => (review.id === id ? advanced : review))
        : [...current, advanced];
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setReviews([]);
    write([]);
  }, []);

  return { reviews, ready, record, reset, progress: summarise(reviews) };
}
