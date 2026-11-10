import { lessons, quizQuestions } from "@/data/lessons";
import { stories } from "@/data/stories";

const approvedSpeech = new Set<string>([
  ...lessons.flatMap(lesson => [
    ...lesson.lines.map(line => line.indonesian),
    ...lesson.vocab.map(item => item.word),
  ]),
  ...quizQuestions.map(question => question.audio),
  ...stories.flatMap(story => [
    story.titleId,
    ...story.paragraphs.map(paragraph => paragraph.indonesian),
    ...story.vocab.map(item => item.word),
  ]),
]);

export function isApprovedSpeechText(text: string): boolean {
  return approvedSpeech.has(text);
}