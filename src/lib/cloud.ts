import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface CloudMistake {
  id: string;
  kind: string;
  word: string;
  meaning: string;
  your_answer: string;
  lesson_id: string | null;
  count: number;
  last_at: string;
  review_stage: number;
  next_review_at: string | null;
  mastered_at: string | null;
  review_updated_at: string;
}

/** 读取当前用户的全部错题 */
export const loadMistakes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("mistakes")
      .select("id, kind, word, meaning, your_answer, lesson_id, count, last_at, review_stage, next_review_at, mastered_at, review_updated_at")
      .order("last_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as CloudMistake[];
  });

/** 合并写入一条错题（同 id 则累加次数） */
export const saveMistake = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; kind: string; word: string; meaning: string; yourAnswer: string; lessonId?: string; count: number; lastAt: number; reviewStage: number; nextReviewAt: number | null; masteredAt: number | null; reviewUpdatedAt: number }) => {
    if (!Number.isInteger(d.reviewStage) || d.reviewStage < 0 || d.reviewStage > 2 || !Number.isFinite(d.reviewUpdatedAt)) throw new Error("Invalid review state");
    return d;
  })
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("mistakes").upsert({
      id: data.id,
      user_id: context.userId,
      kind: data.kind,
      word: data.word,
      meaning: data.meaning,
      your_answer: data.yourAnswer,
      lesson_id: data.lessonId ?? null,
      count: data.count,
      last_at: new Date(data.lastAt).toISOString(),
      review_stage: data.reviewStage,
      next_review_at: data.nextReviewAt === null ? null : new Date(data.nextReviewAt).toISOString(),
      mastered_at: data.masteredAt === null ? null : new Date(data.masteredAt).toISOString(),
      review_updated_at: new Date(data.reviewUpdatedAt).toISOString(),
    }, { onConflict: "user_id,id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeMistakeCloud = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("mistakes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearMistakesCloud = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.from("mistakes").delete().eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** 记录一次测验成绩 */
export const saveQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId?: string; total: number; correct: number }) => d)
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("quiz_attempts").insert({
      user_id: context.userId,
      lesson_id: data.lessonId ?? null,
      total: data.total,
      correct: data.correct,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** 保存一次 AI 批改结果 */
export const saveCoachResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId?: string; prompt: string; answer: string; feedback: string }) => d)
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("coach_results").insert({
      user_id: context.userId,
      lesson_id: data.lessonId ?? null,
      prompt: data.prompt.slice(0, 1000),
      answer: data.answer.slice(0, 1000),
      feedback: data.feedback.slice(0, 8000),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
