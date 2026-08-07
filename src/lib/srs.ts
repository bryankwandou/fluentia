/**
 * Spaced repetition over drill lines.
 *
 * The usual SM-2 asks the learner to rate their own recall from 0 to 5, which
 * is the weakest input in the whole system — people are poor judges of what
 * they know, and a learner who wants a clean streak will inflate. Here the
 * grader has already produced an objective 0-100 from the transcript and the
 * measured pitch, so the schedule is driven by that instead. Nobody is asked
 * how well they think it went.
 *
 * The interval curve is SM-2's, because it has held up for forty years: ease
 * drifts with performance, intervals multiply by ease, and a failure sends the
 * card back to the start of the ladder without destroying its accumulated ease.
 */

export type Review = {
  /** Drill identity: the target line is stable and unique enough to key on. */
  id: string;
  /** Times this card has been answered well in a row. */
  streak: number;
  /** SM-2 ease factor. Starts at 2.5 and floors at 1.3. */
  ease: number;
  /** Days until the next showing. */
  interval: number;
  /** ISO date this card next comes up. */
  due: string;
  /** Total attempts, kept so a learner can see effort, not just outcome. */
  attempts: number;
  /** Last objective score, 0-100. */
  lastScore: number;
};

/** Below this the attempt counts as a lapse and the ladder restarts. */
export const PASS_MARK = 70;

/**
 * Cards are keyed by language and target line. The language belongs in the key
 * because the same string can be a drill in more than one track, and a learner
 * who has mastered it in one has proved nothing about the other.
 */
export function cardId(language: string, target: string) {
  return `${language}::${target}`;
}

/** A card the learner has never attempted. */
export function newReview(id: string, now = new Date()): Review {
  return {
    id,
    streak: 0,
    ease: 2.5,
    interval: 0,
    due: startOfDay(now).toISOString(),
    attempts: 0,
    lastScore: 0,
  };
}

/**
 * Map an objective 0-100 onto SM-2's quality scale. The mapping is deliberately
 * ungenerous in the middle: 70 is the pass mark, and a 75 earns a short
 * interval rather than a comfortable one.
 */
export function quality(score: number) {
  if (score >= 95) return 5;
  if (score >= 85) return 4;
  if (score >= PASS_MARK) return 3;
  if (score >= 55) return 2;
  if (score >= 35) return 1;
  return 0;
}

/**
 * Advance a card after an attempt. Pure: takes the old state and a score,
 * returns the new state. Everything schedule-related is decided here so it can
 * be tested without a browser, a clock, or a learner.
 */
export function schedule(review: Review, score: number, now = new Date()): Review {
  const q = quality(score);
  const passed = q >= 3;

  // SM-2's ease update. A perfect answer nudges ease up, a scraped pass nudges
  // it down, and it never falls below 1.3 or the card would be shown forever.
  const ease = Math.max(
    1.3,
    review.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  const streak = passed ? review.streak + 1 : 0;

  let interval: number;
  if (!passed) {
    // A lapse returns the card to same-day practice but keeps the ease it
    // earned, so one bad recording does not undo a month of work.
    interval = 0;
  } else if (streak === 1) {
    interval = 1;
  } else if (streak === 2) {
    interval = 6;
  } else {
    interval = Math.round(review.interval * ease) || 1;
  }

  return {
    id: review.id,
    streak,
    ease: round(ease, 2),
    interval,
    due: addDays(startOfDay(now), interval).toISOString(),
    attempts: review.attempts + 1,
    lastScore: Math.round(score),
  };
}

/** Cards that have come up, oldest due date first. */
export function due(reviews: Review[], now = new Date()) {
  const cutoff = endOfDay(now).getTime();
  return reviews
    .filter((review) => new Date(review.due).getTime() <= cutoff)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());
}

export type Progress = {
  total: number;
  /** Never attempted. */
  fresh: number;
  /** Attempted but not yet past the second successful interval. */
  learning: number;
  /** Interval of 21 days or more, the usual definition of retained. */
  mature: number;
  dueNow: number;
  /** Mean of the last score across every attempted card. */
  meanScore: number;
};

export function summarise(reviews: Review[], now = new Date()): Progress {
  const attempted = reviews.filter((review) => review.attempts > 0);
  const mature = attempted.filter((review) => review.interval >= 21);

  return {
    total: reviews.length,
    fresh: reviews.length - attempted.length,
    learning: attempted.length - mature.length,
    mature: mature.length,
    dueNow: due(reviews, now).length,
    meanScore: attempted.length
      ? Math.round(
          attempted.reduce((sum, review) => sum + review.lastScore, 0) /
            attempted.length
        )
      : 0,
  };
}

/**
 * Build the queue for a session: everything due, then fresh cards to fill the
 * gap. Reviews come first because a card about to be forgotten is worth more
 * than a card never seen — that ordering is the whole point of the algorithm.
 */
export function buildQueue(
  reviews: Review[],
  available: string[],
  limit = 20,
  now = new Date()
) {
  const known = new Map(reviews.map((review) => [review.id, review]));
  const queue = due(reviews, now).slice(0, limit);

  for (const id of available) {
    if (queue.length >= limit) break;
    if (!known.has(id)) queue.push(newReview(id, now));
  }

  return queue;
}

/* ------------------------------------------------------------------ dates */

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function round(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
