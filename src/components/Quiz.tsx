import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Volume2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { quizQuestions } from "@/data/lessons";
import { speakIndonesian } from "@/lib/speech";
import { addMistake } from "@/lib/mistakes";

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[current];
  if (!q) return null;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
    else addMistake({ kind: "quiz", word: q.audio, meaning: q.options[q.answer] ?? "", yourAnswer: q.options[i] ?? "" });
  };

  const next = () => {
    if (current + 1 >= quizQuestions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center shadow-sm">
        <div className="font-display text-6xl font-bold text-primary">
          {pct}
          <span className="text-2xl">分</span>
        </div>
        <p className="mt-3 text-lg font-medium text-card-foreground">
          答对 {score} / {quizQuestions.length} 题
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {pct >= 80
            ? "Bagus sekali！太棒了，你已经可以和印尼朋友聊起来了！"
            : pct >= 60
              ? "不错！再听几遍对话，进步会很快。"
              : "别灰心，回到上面的对话多跟读几遍再试试。"}
        </p>
        <Button
          onClick={restart}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RotateCcw className="h-4 w-4" /> 再测一次
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          第 {current + 1} / {quizQuestions.length} 题
        </span>
        <span>得分：{score}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }}
        />
      </div>

      <p className="mt-6 text-lg font-semibold text-card-foreground">
        {q.question}
      </p>

      <Button
        onClick={() => speakIndonesian(q.audio)}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <Volume2 className="h-4 w-4" /> 播放录音
      </Button>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const isCorrect = selected !== null && i === q.answer;
          const isWrong = selected === i && i !== q.answer;
          return (
            <Button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                isCorrect
                  ? "border-accent bg-accent/10 text-foreground"
                  : isWrong
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:bg-secondary"
              }`}
            >
              {opt}
              {isCorrect && <CheckCircle2 className="h-4 w-4 text-accent" />}
              {isWrong && <XCircle className="h-4 w-4 text-destructive" />}
            </Button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          {q.explanation}
        </div>
      )}

      {selected !== null && (
        <Button
          onClick={next}
          className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {current + 1 >= quizQuestions.length ? "查看成绩" : "下一题"}
        </Button>
      )}
    </div>
  );
}
