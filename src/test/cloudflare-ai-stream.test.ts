import { describe, expect, it } from "vitest";
import { cloudflareAiTextStream } from "@/server/cloudflare-ai";

async function readText(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

describe("Cloudflare AI stream", () => {
  it("extracts generated text from SSE events split across chunks", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"response":"Halo"}\n\ndata: {"res'));
        controller.enqueue(encoder.encode('ponse":" dunia"}\n\ndata: [DONE]\n\n'));
        controller.close();
      },
    });

    await expect(readText(cloudflareAiTextStream(stream))).resolves.toBe("Halo dunia");
  });

  it("returns a readable fallback when the model yields no text", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.close();
      },
    });

    await expect(readText(cloudflareAiTextStream(stream))).resolves.toContain("AI 没有返回内容");
  });
});
