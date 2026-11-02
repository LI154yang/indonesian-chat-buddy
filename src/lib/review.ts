import { useEffect, useState } from "react";

export const REVIEW_DAYS = [1, 3, 7] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReviewState {
  reviewStage: number;
  nextReviewAt: number | null;
  masteredAt: number | null;
  reviewUpdatedAt: number;
}

export function initialReview(now: number): ReviewState {
  return { reviewStage: 0, nextReviewAt: now + DAY_MS, masteredAt: null, reviewUpdatedAt: now };
}

export function resolveReview(state: ReviewState, correct: boolean, now: number): ReviewState {
  if (correct) return { ...state, nextReviewAt: null, masteredAt: now, reviewUpdatedAt: now };
  const reviewStage = Math.min(state.reviewStage + 1, REVIEW_DAYS.length - 1);
  return { reviewStage, nextReviewAt: now + (REVIEW_DAYS[reviewStage] ?? 7) * DAY_MS, masteredAt: null, reviewUpdatedAt: now };
}

export function isReviewDue(state: ReviewState, now: number): boolean {
  return state.masteredAt === null && state.nextReviewAt !== null && state.nextReviewAt <= now;
}

export function normalizeReviewAnswer(text: string): string {
  return text.toLowerCase().replace(/[?!.,…'"’]/g, "").replace(/\s+/g, " ").trim();
}

export function useReviewClock() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 30_000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return now;
}