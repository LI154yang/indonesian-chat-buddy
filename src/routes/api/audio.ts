import { generateSpeech } from "@lovable.dev/ai-gateway";
import { createFileRoute } from "@tanstack/react-router";
import { isApprovedSpeechText } from "@/lib/speech-catalog";

export const Route = createFileRoute("/api/audio")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const text = new URL(request.url).searchParams.get("text")?.trim() ?? "";
        if (!text || text.length > 350 || !isApprovedSpeechText(text)) {
          return Response.json({ error: "这段朗读内容暂不可用。" }, { status: 400 });
        }

        try {
          const audio = await generateSpeech({
            model: "google/gemini-3.1-flash-tts-preview",
            contents: [{ role: "user", parts: [{ text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                languageCode: "id-ID",
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
              },
            },
          }, { signal: request.signal });

          return audio.toResponse({
            headers: {
              "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json({ error: "语音暂时无法播放，请稍后重试。" }, { status: 502 });
        }
      },
    },
  },
});