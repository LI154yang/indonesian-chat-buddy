import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Headphones, MessageCircle, BookOpen, Trophy, Volume2 } from "lucide-react";
import { lessons } from "@/data/lessons";
import { DialoguePlayer } from "@/components/DialoguePlayer";
import { Quiz } from "@/components/Quiz";
import { speakIndonesian } from "@/lib/speech";
import heroImage from "@/assets/hero-warung.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ngobrol! 印尼语听力课堂 — 学会和印尼人聊天" },
      {
        name: "description",
        content:
          "通过真实情景对话学印尼语：打招呼、市场砍价、餐厅点餐。逐句听力跟读、文化贴士和互动测验，让你自信开口与印尼人交流。",
      },
      { property: "og:title", content: "Ngobrol! 印尼语听力课堂" },
      {
        property: "og:description",
        content: "真实情景对话 + 逐句听力跟读，轻松学会和印尼人交流。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const levelColors: Record<string, string> = {
  入门: "bg-accent text-accent-foreground",
  初级: "bg-primary text-primary-foreground",
  进阶: "bg-destructive text-destructive-foreground",
};

function Index() {
  const [activeLesson, setActiveLesson] = useState(lessons[0].id);
  const lesson = lessons.find((l) => l.id === activeLesson)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="batik-dots relative overflow-hidden">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
              N
            </span>
            <span className="font-display text-xl font-bold text-foreground">
              Ngobrol!
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#lessons" className="transition-colors hover:text-primary">
              情景课程
            </a>
            <a href="#quiz" className="transition-colors hover:text-primary">
              听力测验
            </a>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Headphones className="h-3.5 w-3.5" /> 印尼语听力 · 情景对话
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              开口和印尼人
              <span className="text-primary">聊起来</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              从打招呼到砍价点餐，用真实生活场景练听力、学表达。
              逐句跟读 + 文化贴士，让你不只是「会说」，更「会聊」。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#lessons"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" /> 开始第一课
              </a>
              <a
                href="#quiz"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Trophy className="h-4 w-4" /> 测测听力
              </a>
            </div>
          </div>
          <div className="animate-float-slow">
            <img
              src={heroImage}
              alt="两位朋友在印尼 Warung 里边喝咖啡边聊天"
              width={1536}
              height={1024}
              className="w-full rounded-3xl border-4 border-card shadow-2xl"
            />
          </div>
        </div>
      </header>

      {/* Lessons */}
      <main id="lessons" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="font-display text-3xl font-bold text-foreground">
            情景课程
          </h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          选择一个场景，点击每句旁边的喇叭逐句跟读，或播放整段对话。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {lessons.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLesson(l.id)}
              className={`rounded-2xl border px-5 py-3 text-left transition-all ${
                activeLesson === l.id
                  ? "border-primary bg-card shadow-md"
                  : "border-border bg-card/60 hover:bg-card"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${levelColors[l.level] ?? levelColors["入门"]}`}
                >
                  {l.level}
                </span>
                <span className="font-semibold text-foreground">{l.title}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {l.subtitle}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          <DialoguePlayer key={lesson.id} lesson={lesson} />

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-foreground">
              本课词汇
            </h3>
            <ul className="mt-4 space-y-3">
              {lesson.vocab.map((v) => (
                <li
                  key={v.word}
                  className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {v.word}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {v.meaning}
                    </div>
                  </div>
                  <button
                    onClick={() => speakIndonesian(v.word)}
                    aria-label={`播放：${v.word}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>

      {/* Quiz */}
      <section id="quiz" className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">
              听力小测验
            </h2>
          </div>
          <p className="mt-2 text-muted-foreground">
            听录音选答案，看看你能听懂多少印尼语！
          </p>
          <div className="mt-8">
            <Quiz />
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <p className="font-display text-base font-semibold text-foreground">
          Ngobrol! · 印尼语听力课堂
        </p>
        <p className="mt-1">
          Selamat belajar! 学习愉快 — 点击任意句子即可收听印尼语发音
        </p>
      </footer>
    </div>
  );
}
