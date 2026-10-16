import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { LearningShell } from "@/components/LearningShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "登录 / 注册 · Ngobrol! 印尼语听力课堂" },
      { name: "description", content: "登录后，你的错题、测验成绩和 AI 批改记录会保存到账号里，换设备也不丢。" },
      { property: "og:title", content: "登录 / 注册 · Ngobrol!" },
      { property: "og:description", content: "保存你的学习记录。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.message.includes("Invalid login") ? "邮箱或密码不正确。" : err.message);
          return;
        }
        navigate({ to: "/" });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) {
          setError(err.message);
          return;
        }
        if (data.session) {
          navigate({ to: "/" });
        } else {
          setMessage("注册成功！请到你的邮箱点击确认链接，然后再回来登录。");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LearningShell>
      <main className="mx-auto max-w-md px-5 py-14 sm:px-8">
        <h1 className="font-display text-3xl font-bold">{mode === "login" ? "登录" : "注册"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          登录后，错题、测验成绩和 AI 批改记录都会保存到你的账号，换设备也能接着学。
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium">邮箱</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ni@example.com"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">密码</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="mt-1 w-full rounded-md border border-input bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-accent">{message}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {mode === "login" ? <LogIn /> : <UserPlus />}
            {loading ? "请稍候…" : mode === "login" ? "登录" : "注册"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "还没有账号？" : "已经有账号了？"}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
              className="ml-1 text-primary hover:underline"
            >
              {mode === "login" ? "去注册" : "去登录"}
            </button>
          </p>
        </form>
      </main>
    </LearningShell>
  );
}
