import { beforeEach, describe, expect, it } from "vitest";
import { getLocalProfile, recordLocalCoachResult, recordLocalQuizAttempt, saveLocalProfile } from "@/lib/local-profile";

describe("local learner profile", () => {
  beforeEach(() => {
    localStorage.clear();
    saveLocalProfile({ name: "学习者", attempts: [], coachResults: [] });
  });

  it("saves a nickname and quiz result in the browser profile", () => {
    saveLocalProfile({
      name: "小李",
      attempts: [],
      coachResults: [],
    });
    recordLocalQuizAttempt({ lessonId: "market", correct: 4, total: 5, at: 1234 });

    expect(getLocalProfile().name).toBe("小李");
    expect(getLocalProfile().attempts).toEqual([{ lessonId: "market", correct: 4, total: 5, at: 1234 }]);
    expect(JSON.parse(localStorage.getItem("ngobrol-local-learning-profile-v1") ?? "{}").attempts).toHaveLength(1);
  });

  it("keeps complete AI correction feedback for later review", () => {
    recordLocalCoachResult({ lessonId: "greeting", prompt: "怎么打招呼？", answer: "Apa kabar", feedback: "表达自然。", at: 5678 });

    expect(getLocalProfile().coachResults).toEqual([
      { lessonId: "greeting", prompt: "怎么打招呼？", answer: "Apa kabar", feedback: "表达自然。", at: 5678 },
    ]);
  });
});