import { describe, it, expect } from "vitest";
import { mergeMistake } from "@/lib/mistakes";
describe("mistake bank", () => {
  it("counts repeated mistakes on the same word once", () => {
    const e = { kind: "dictation" as const, word: "Kunci", meaning: "钥匙", yourAnswer: "kunchi" };
    const list = mergeMistake(mergeMistake([], e, 1), { ...e, yourAnswer: "kuci" }, 2);
    expect(list).toHaveLength(1);
    expect(list[0]?.count).toBe(2);
    expect(list[0]?.yourAnswer).toBe("kuci");
  });
  it("reopens a graduated word on a new mistake with a 1-day review", () => {
    const e = { kind: "dictation" as const, word: "Kunci", meaning: "钥匙", yourAnswer: "kuci" };
    const old = mergeMistake([], e, 1).map(m => ({ ...m, masteredAt: 2, nextReviewAt: null }));
    const next = mergeMistake(old, e, 100);
    expect(next[0]?.masteredAt).toBeNull();
    expect(next[0]?.nextReviewAt).toBe(100 + 86_400_000);
  });
});
