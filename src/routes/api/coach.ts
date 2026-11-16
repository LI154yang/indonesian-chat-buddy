import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lessons } from "@/data/lessons";
import {
  CLOUDFLARE_AI_MODEL,
  cloudflareAiTextStream,
  getCloudflareAiBinding,
} from "@/server/cloudflare-ai";

const Body = z.object({
  lessonId: z.string(),
  prompt: z.string().max(300).optional(),
  answer: z.string().trim().min(1).max(500),
});

const SYSTEM = `你是一位耐心、专业的印尼语口语老师，学生是中文母语者。学生会在给定的生活情景中，用印尼语写出自己的回答。请用简体中文点评，结构严格如下（使用这些小标题，不要使用 Markdown 符号如 # 或 **）：
【整体评价】一句话，先肯定做得好的地方。
【纠正】逐条列出语法、拼写、用词错误：原文 → 修改 → 简短原因。如果没有错误就写"没有明显错误"。
【更自然的说法】给出 1-2 句印尼本地人更常用的说法（印尼语），每句后附中文意思，并说明适用场合（正式/口语）。
【小贴士】一条与该情景相关的文化或礼貌提示。
如果学生写的不是印尼语，温和提醒并给出一个示范回答。保持简洁。`;

export const Route = createFileRoute("/api/coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          body = null;
        }
        const parsed = Body.safeParse(body);
        if (!parsed.success)
          return Response.json({ error: "请输入 1-500 字的回答。" }, { status: 400 });
        const lesson = lessons.find((l) => l.id === parsed.data.lessonId);
        if (!lesson) return Response.json({ error: "课程不存在。" }, { status: 404 });
        const ai = getCloudflareAiBinding();
        if (!ai)
          return Response.json(
            { error: "Cloudflare AI 服务未启用，请检查 Worker 的 AI 绑定。" },
            { status: 503 },
          );

        const context = `课程：${lesson.title}（${lesson.level}）\n情景：${lesson.scene}\n练习题目：${parsed.data.prompt ?? "自由回应这个情景"}\n本课词汇：${lesson.vocab.map((v) => `${v.word}=${v.meaning}`).join("，")}\n\n学生的印尼语回答：\n${parsed.data.answer}`;
        let upstream: ReadableStream<Uint8Array>;
        try {
          upstream = await ai.run(CLOUDFLARE_AI_MODEL, {
            messages: [
              { role: "system", content: SYSTEM },
              { role: "user", content: context },
            ],
            stream: true,
          });
        } catch (error) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          console.error("Cloudflare AI request failed:", error);
          return Response.json({ error: "AI 暂时无法回应，请稍后再试。" }, { status: 502 });
        }

        return new Response(cloudflareAiTextStream(upstream), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
