import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lessons } from "@/data/lessons";
import { stories } from "@/data/stories";
import {
  CLOUDFLARE_AI_MODEL,
  cloudflareAiTextStream,
  getCloudflareAiBinding,
  type CloudflareAiMessage,
} from "@/server/cloudflare-ai";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(30),
  mistakes: z.array(z.string().max(200)).max(40).optional(),
});

const catalog = lessons
  .map(
    (l) => `· ${l.title}（${l.level}）：${l.vocab.map((v) => `${v.word}=${v.meaning}`).join("，")}`,
  )
  .join("\n");
const storyList = stories.map((s) => `· ${s.title}（${s.titleId}）`).join("\n");

const SYSTEM = `你是「Ngobrol! 印尼语听力课堂」的学习助手，学生是中文母语者。你的任务是帮学生整合学过的内容：总结课程重点、按主题归纳词汇和句型、对比易混词、根据错题制定复习计划、出小练习。用简体中文回答，印尼语例句后附中文。回答简洁有条理，可以用简单的 - 列表，不要用 # 或 ** 等 Markdown 符号。

本站课程与词汇：
${catalog}

故事阅读：
${storyList}`;

export const Route = createFileRoute("/api/assistant")({
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
          return Response.json({ error: "消息格式不正确或太长。" }, { status: 400 });
        const ai = getCloudflareAiBinding();
        if (!ai)
          return Response.json(
            { error: "Cloudflare AI 服务未启用，请检查 Worker 的 AI 绑定。" },
            { status: 503 },
          );
        const mistakeNote = parsed.data.mistakes?.length
          ? `\n\n学生错题库里的词：${parsed.data.mistakes.join("，")}`
          : "";
        const messages: CloudflareAiMessage[] = [
          { role: "system", content: SYSTEM + mistakeNote },
          ...parsed.data.messages,
        ];
        let upstream: ReadableStream<Uint8Array>;
        try {
          upstream = await ai.run(CLOUDFLARE_AI_MODEL, {
            messages,
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
