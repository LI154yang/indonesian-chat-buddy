import { describe, expect, it } from "vitest";
import { initialReview, isReviewDue, normalizeReviewAnswer, resolveReview } from "@/lib/review";

const DAY = 86_400_000;
const start = Date.UTC(2026, 10, 2);

describe("spaced mistake review", () => {
  it("schedules the first review exactly 1 day after a mistake", () => {
    const state = initialReview(start);
    expect(state.nextReviewAt).toBe(start + DAY);
    expect(isReviewDue(state, start + DAY - 1)).toBe(false);
    expect(isReviewDue(state, start + DAY)).toBe(true);
  });
  it("schedules a failed first review 3 days later", () => {
    const reviewedAt = start + DAY;
    expect(resolveReview(initialReview(start), false, reviewedAt).nextReviewAt).toBe(reviewedAt + 3 * DAY);
  });
  it("schedules a failed second review 7 days later", () => {
    const first = resolveReview(initialReview(start), false, start + DAY);
    const reviewedAt = start + 4 * DAY;
    const second = resolveReview(first, false, reviewedAt);
    expect(second.nextReviewAt).toBe(reviewedAt + 7 * DAY);
    expect(resolveReview(second, false, reviewedAt + 7 * DAY).nextReviewAt).toBe(reviewedAt + 14 * DAY);
  });
  it("graduates immediately on a correct review with no further reminders", () => {
    const state = resolveReview(initialReview(start), true, start + DAY);
    expect(state.masteredAt).toBe(start + DAY);
    expect(state.nextReviewAt).toBeNull();
    expect(isReviewDue(state, start + 100 * DAY)).toBe(false);
  });
  it("accepts capitalization, punctuation, and extra spaces without accepting a typo", () => {
    expect(normalizeReviewAnswer("  SELAMAT   PAGI! ")).toBe(normalizeReviewAnswer("Selamat pagi"));
    expect(normalizeReviewAnswer("kunchi")).not.toBe(normalizeReviewAnswer("Kunci"));
  });
});