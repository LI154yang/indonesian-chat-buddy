import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isSpeechSupported, speakIndonesian, stopSpeaking } from "@/lib/speech";

class MockUtterance {
  lang = "";
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(readonly text: string) {
    utterances.push(this);
  }
}

class MockAudio {
  preload = "";
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(async () => {});
  pause = vi.fn();
  removeAttribute = vi.fn();
  load = vi.fn();

  constructor(readonly src: string) {
    audioInstances.push(this);
  }
}

const indonesianVoice = { lang: "id-ID" } as unknown as SpeechSynthesisVoice;
let utterances: MockUtterance[] = [];
let audioInstances: MockAudio[] = [];
let speechMock: { getVoices: ReturnType<typeof vi.fn>; speak: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> };

describe("Indonesian speech playback", () => {
  beforeEach(() => {
    utterances = [];
    audioInstances = [];
    speechMock = {
      getVoices: vi.fn(() => [indonesianVoice]),
      speak: vi.fn(),
      cancel: vi.fn(),
    };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speechMock });
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
    vi.stubGlobal("Audio", undefined);
  });

  afterEach(() => {
    stopSpeaking();
    vi.unstubAllGlobals();
  });

  it("uses device speech when Audio is unavailable and selects Indonesian at rate 0.85", () => {
    expect(isSpeechSupported()).toBe(true);
    const onEnd = vi.fn();

    expect(speakIndonesian("Selamat pagi", { onEnd })).toBe(true);

    const utterance = utterances[0];
    expect(utterance).toBeDefined();
    if (!utterance) return;
    expect(utterance.text).toBe("Selamat pagi");
    expect(utterance.lang).toBe("id-ID");
    expect(utterance.rate).toBe(0.85);
    expect(utterance.voice).toBe(indonesianVoice);
    expect(speechMock.speak).toHaveBeenCalledWith(utterance);

    utterance.onend?.();
    expect(onEnd).toHaveBeenCalledTimes(1);
    utterance.onerror?.();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("tries audio first and falls back to device speech when audio errors", () => {
    vi.stubGlobal("Audio", MockAudio as unknown as typeof Audio);

    expect(speakIndonesian("Terima kasih")).toBe(true);
    const audio = audioInstances[0];
    expect(audio).toBeDefined();
    expect(speechMock.speak).not.toHaveBeenCalled();

    audio?.onerror?.();
    expect(utterances).toHaveLength(1);
    expect(utterances[0]?.lang).toBe("id-ID");
  });

  it("cancels fallback speech without firing its completion callback", () => {
    const onEnd = vi.fn();
    speakIndonesian("Sampai jumpa", { onEnd });
    const utterance = utterances[0];
    expect(utterance).toBeDefined();

    speechMock.cancel.mockClear();
    stopSpeaking();
    utterance?.onend?.();
    utterance?.onerror?.();

    expect(speechMock.cancel).toHaveBeenCalledTimes(1);
    expect(onEnd).not.toHaveBeenCalled();
  });
});