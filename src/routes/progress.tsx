import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Bar, BarChart } from "recharts";
import { LearningShell } from "@/components/LearningShell";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { lessons } from "@/data/lessons";
import { loadProgress } from "@/lib/cloud";
import { useMistakes } from "@/lib/mistakes";
import { useLocalProfile } from "@/lib/local-profile";
import { lessonProgress, openMistakeTrend, PASS_RATE, studyStreak } from "@/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "我的学习 · Ngobrol! 印尼语听力课堂" },
      { name: "description", content: "查看每课完成度、测验成绩曲线、连续学习天数和错题减少趋势。" },
      { property: "og:title", content: "我的学习 · Ngobrol! 印尼语听力课堂" },
      { property: "og:description", content: "查看每课完成度、测验成绩曲线、连续学习天数和错题减少趋势。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => { data.subscription.unsubscribe(); };
  }, []);
  return (
    <LearningShell>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl font-bold">我的学习</h1>
        <p className="mt-2 text-muted-foreground">看看自己走了多远。</p>
        {signedIn === null ? <p className="mt-8 text-muted-foreground">正在读取学习记录…</p> : <Dashboard signedIn={signedIn} />}
      </main>
    </LearningShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function Dashboard({ signedIn }: { signedIn: boolean }) {
  const { data, isLoading, error } = useQuery({ queryKey: ["progress"], queryFn: () => loadProgress(), enabled: signedIn });
  const localProfile = useLocalProfile();
  const mistakes = useMistakes();
  if (signedIn && isLoading) return <p className="mt-8 text-muted-foreground">加载中…</p>;
  if (signedIn && (error || !data)) return <p className="mt-8 text-destructive">学习记录加载失败，请稍后刷新。</p>;

  const attempts = signedIn ? data?.attempts ?? [] : localProfile.attempts;
  const coachResults = signedIn ? data?.coachResults ?? [] : localProfile.coachResults;

  const now = Date.now();
  const tz = new Date().getTimezoneOffset();
  const streak = studyStreak([...attempts.map(a => a.at), ...coachResults.map(r => r.at), ...mistakes.map(m => m.lastAt), ...mistakes.flatMap(m => m.masteredAt ? [m.masteredAt] : [])], now, tz);
  const best = lessonProgress(attempts);
  const done = lessons.filter(l => (best.get(l.id) ?? 0) >= PASS_RATE).length;
  const scores = attempts.slice(-20).map((a, i) => ({ n: `${i + 1}`, score: Math.round((a.correct / a.total) * 100) }));
  const trend = openMistakeTrend(mistakes, now);

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<Flame className="text-primary" />} label="连续学习" value={`${streak} 天`} />
        <Stat icon={<Trophy className="text-primary" />} label="完成课程" value={`${done} / ${lessons.length}`} />
        <Stat icon={<Trophy className="text-accent" />} label="测验次数" value={`${attempts.length}`} />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">每课完成度</h2>
        <p className="text-sm text-muted-foreground">取本课小测最高分，达到 60% 即算完成。</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {lessons.map(l => {
            const pct = Math.round((best.get(l.id) ?? 0) * 100);
            return (
              <li key={l.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex justify-between text-sm">
                  <Link to="/lessons/$lessonId" params={{ lessonId: l.id }} className="font-medium hover:text-primary">{l.title}</Link>
                  <span className="text-muted-foreground">{pct >= PASS_RATE * 100 ? "✓ " : ""}{pct}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-xl font-semibold">测验成绩曲线</h2>
          <p className="text-sm text-muted-foreground">最近 20 次测验得分（%）</p>
          {scores.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">还没有测验记录，去做一次本课小测吧。</p> : (
            <ChartContainer config={{ score: { label: "得分", color: "var(--primary)" } }} className="mt-4 h-56 w-full">
              <LineChart data={scores}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="n" tickLine={false} />
                <YAxis domain={[0, 100]} width={30} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot />
              </LineChart>
            </ChartContainer>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-xl font-semibold">错题减少趋势</h2>
          <p className="text-sm text-muted-foreground">每周末仍未毕业的错题数</p>
          <ChartContainer config={{ open: { label: "未毕业错题", color: "var(--accent)" } }} className="mt-4 h-56 w-full">
            <BarChart data={trend}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} />
              <YAxis allowDecimals={false} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="open" fill="var(--color-open)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">AI 批改记录</h2>
        {coachResults.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">完成一次情景表达练习后，批改内容会保存在这里。</p> : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {coachResults.slice(0, 10).map((result, index) => (
              <li key={`${result.at}-${index}`} className="py-5">
                <p className="text-xs text-muted-foreground">{new Date(result.at).toLocaleString()}</p>
                <p className="mt-2 text-sm font-medium">{result.prompt}</p>
                <p className="mt-2 text-sm"><span className="text-muted-foreground">你的回答：</span>{result.answer}</p>
                <p className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm leading-relaxed">{result.feedback}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
