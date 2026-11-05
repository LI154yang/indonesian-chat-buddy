import { describe, it, expect } from "vitest";
import { lessonProgress, openMistakeTrend, studyStreak } from "@/lib/progress";
const D = 86_400_000;
describe("learning progress", () => {
  it("counts consecutive study days, tolerating no activity yet today", () => {
    const now = 10 * D + 1000;
    expect(studyStreak([9 * D, 8 * D + 5, 7 * D, 5 * D], now)).toBe(3);
    expect(studyStreak([10 * D, 9 * D], now)).toBe(2);
    expect(studyStreak([7 * D], now)).toBe(0);
  });
  it("keeps the best score per lesson", () => {
    const p = lessonProgress([
      { lessonId: "market", correct: 2, total: 5, at: 1 },
      { lessonId: "market", correct: 4, total: 5, at: 2 },
      { lessonId: null, correct: 5, total: 5, at: 3 },
    ]);
    expect(p.get("market")).toBe(0.8);
    expect(p.size).toBe(1);
  });
  it("drops graduated mistakes from the open trend", () => {
    const now = 100 * D;
    const t = openMistakeTrend([{ lastAt: 80 * D, masteredAt: 97 * D }, { lastAt: 99 * D, masteredAt: null }], now, 3);
    expect(t.map(x => x.open)).toEqual([1, 1, 1]);
    expect(openMistakeTrend([{ lastAt: 80 * D, masteredAt: 97 * D }], now, 2).map(x => x.open)).toEqual([1, 0]);
  });
});
