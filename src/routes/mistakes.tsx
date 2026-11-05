import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Volume2, Check, BellRing } from "lucide-react";
import { LearningShell } from "@/components/LearningShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lessons } from "@/data/lessons";
import { speakIndonesian } from "@/lib/speech";
import { clearMistakes, removeMistake, reviewMistake, useMistakes, type Mistake } from "@/lib/mistakes";
import { isReviewDue, normalizeReviewAnswer, useReviewClock } from "@/lib/review";

export const Route = createFileRoute("/mistakes")({
  head: () => ({
    meta: [
      { title: "错题库 · Ngobrol! 印尼语听力课堂" },
      { name: "description", content: "答错的单词按 1、3、7 天间隔提醒重练，答对即毕业。" },
      { property: "og:title", content: "错题库 · Ngobrol! 印尼语听力课堂" },
      { property: "og:description", content: "答错的单词按 1、3、7 天间隔提醒重练，答对即毕业。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MistakesPage,
});

function formatNext(at: number | null, now: number) {
  if (at === null) return "";
  const days = Math.ceil((at - now) / 86_400_000);
  return days <= 1 ? "明天复习" : `${days} 天后复习`;
}

function ReviewCard({ m }: { m: Mistake }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  function submit() {
    const ok = normalizeReviewAnswer(answer) === normalizeReviewAnswer(m.word);
    setResult(ok);
    window.setTimeout(() => reviewMistake(m.id, ok, answer), 1200);
  }
  return (
    <li className="rounded-lg border border-primary/40 bg-card p-4">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="icon" onClick={() => speakIndonesian(m.word)} aria-label="播放发音"><Volume2 /></Button>
        <span className="text-sm text-muted-foreground">听发音，写出单词（提示：{m.meaning}）</span>
      </div>
      <form className="mt-3 flex gap-2" onSubmit={e => { e.preventDefault(); if (result === null) submit(); }}>
        <Input value={answer} onChange={e => setAnswer(e.target.value)} placeholder="输入印尼语" disabled={result !== null} aria-label="复习答案" />
        <Button type="submit" disabled={!answer.trim() || result !== null}>提交</Button>
      </form>
      {result === true && <p className="mt-2 text-sm text-primary">答对了！这个词已毕业 🎓</p>}
      {result === false && <p className="mt-2 text-sm text-destructive">正确答案：{m.word}，稍后再提醒你</p>}
    </li>
  );
}

function MistakesPage() {
  const mistakes = useMistakes();
  const now = useReviewClock();
  const due = now ? mistakes.filter(m => isReviewDue(m, now)) : [];
  const dueIds = new Set(due.map(m => m.id));
  const rest = mistakes.filter(m => !dueIds.has(m.id));

  return (
    <LearningShell>
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">错题库</h1>
            <p className="mt-2 text-muted-foreground">答错的词会在 1 天、3 天、7 天后提醒你重练，答对就毕业。登录后会保存到账号。</p>
          </div>
          {mistakes.length > 0 && (
            <Button variant="outline" onClick={() => { if (confirm("确定清空所有错题？")) clearMistakes(); }}>
              <Trash2 /> 清空
            </Button>
          )}
        </div>

        {due.length > 0 && (
          <section className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><BellRing className="text-primary" />今天该复习了（{due.length}）</h2>
            <ul className="mt-4 space-y-3">{due.map(m => <ReviewCard key={m.id} m={m} />)}</ul>
          </section>
        )}

        {mistakes.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">还没有错题，太棒了！去课程里练习听写或做听力测验吧。</p>
            <Button className="mt-4" asChild><Link to="/">去课程中心</Link></Button>
          </div>
        ) : rest.length > 0 && (
          <ul className="mt-8 space-y-3">
            {rest.map(m => {
              const lesson = lessons.find(l => l.id === m.lessonId);
              return (
                <li key={m.id} className={`flex items-start gap-3 rounded-lg border border-border bg-card p-4 ${m.masteredAt ? "opacity-60" : ""}`}>
                  <Button variant="secondary" size="icon" onClick={() => speakIndonesian(m.word)} aria-label={`播放 ${m.word}`}>
                    <Volume2 />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {m.kind === "dictation" ? "听写" : "听力测验"}
                      </span>
                      <p className="font-display text-lg font-semibold">{m.word}</p>
                      <span className="text-sm text-muted-foreground">{m.meaning}</span>
                    </div>
                    <p className="mt-1 text-sm text-destructive">你的答案：{m.yourAnswer || "（空）"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      错 {m.count} 次 · {m.masteredAt ? "已毕业" : formatNext(m.nextReviewAt, now)}
                      {lesson && <> · <Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} className="text-primary hover:underline">{lesson.title}</Link></>}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMistake(m.id)} title="移出错题库">
                    <Check /> 移除
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </LearningShell>
  );
}
