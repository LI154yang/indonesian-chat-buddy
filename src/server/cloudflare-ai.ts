import { getRequest } from "@tanstack/react-start/server";

export const CLOUDFLARE_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

export type CloudflareAiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type CloudflareAiBinding = {
  run(
    model: string,
    input: { messages: CloudflareAiMessage[]; stream: true },
  ): Promise<ReadableStream<Uint8Array>>;
};

export function getCloudflareAiBinding(): CloudflareAiBinding | undefined {
  const request = getRequest() as Request & {
    runtime?: { cloudflare?: { env?: { AI?: CloudflareAiBinding } } };
  };
  return request.runtime?.cloudflare?.env?.AI;
}

export function cloudflareAiTextStream(
  upstream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let hasOutput = false;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const event = JSON.parse(payload) as { response?: unknown; error?: unknown };
              if (typeof event.response === "string" && event.response) {
                hasOutput = true;
                controller.enqueue(encoder.encode(event.response));
              } else if (typeof event.error === "string") {
                controller.enqueue(encoder.encode(`\n\n[AI 出错：${event.error}]`));
              }
            } catch {
              continue;
            }
          }
        }
        buffer += decoder.decode();
        if (buffer.startsWith("data:")) {
          const payload = buffer.slice(5).trim();
          if (payload && payload !== "[DONE]") {
            try {
              const event = JSON.parse(payload) as { response?: unknown };
              if (typeof event.response === "string" && event.response) {
                hasOutput = true;
                controller.enqueue(encoder.encode(event.response));
              }
            } catch {
              // Ignore an incomplete final event.
            }
          }
        }
        if (!hasOutput)
          controller.enqueue(encoder.encode("[AI 没有返回内容，请换个说法再试一次。]"));
        controller.close();
      } catch {
        controller.error(new Error("读取 AI 回应失败。"));
      }
    },
    cancel() {
      return reader.cancel();
    },
  });
}
