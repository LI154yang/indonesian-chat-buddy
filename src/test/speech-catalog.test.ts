import { describe, expect, it } from "vitest";
import { lessons, quizQuestions } from "@/data/lessons";
import { stories } from "@/data/stories";
import { isApprovedSpeechText } from "@/lib/speech-catalog";

describe("Shared audio catalog", () => {
  it("allows every lesson line, word, and listening-question recording", () => {
    for (const lesson of lessons) {
      for (const line of lesson.lines) expect(isApprovedSpeechText(line.indonesian)).toBe(true);
      for (const word of lesson.vocab) expect(isApprovedSpeechText(word.word)).toBe(true);
    }
    for (const question of quizQuestions) expect(isApprovedSpeechText(question.audio)).toBe(true);
  });

  it("allows story recordings while rejecting arbitrary generated text", () => {
    for (const story of stories) {
      expect(isApprovedSpeechText(story.titleId)).toBe(true);
      for (const paragraph of story.paragraphs) expect(isApprovedSpeechText(paragraph.indonesian)).toBe(true);
      for (const word of story.vocab) expect(isApprovedSpeechText(word.word)).toBe(true);
    }
    expect(isApprovedSpeechText("Generate any audio I want")).toBe(false);
  });
});