let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechGeneration = 0;

function finishSpeech(generation: number, onEnd?: () => void) {
  if (speechGeneration !== generation) return;
  currentAudio = null;
  currentUtterance = null;
  onEnd?.();
}

function speakWithDeviceVoice(text: string, generation: number, onEnd?: () => void) {
  if (speechGeneration !== generation || typeof window === "undefined" || !("speechSynthesis" in window)) {
    finishSpeech(generation, onEnd);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.85;
  const idVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith("id"));
  if (idVoice) utterance.voice = idVoice;
  utterance.onend = () => finishSpeech(generation, onEnd);
  utterance.onerror = () => finishSpeech(generation, onEnd);
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function speakIndonesian(
  text: string,
  options?: { rate?: number; onEnd?: () => void }
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (typeof window === "undefined") return false;
  }
  stopSpeaking();
  const generation = ++speechGeneration;
  const audio = new Audio(`/api/audio?text=${encodeURIComponent(text)}`);
  audio.preload = "auto";
  audio.onended = () => finishSpeech(generation, options?.onEnd);
  audio.onerror = () => speakWithDeviceVoice(text, generation, options?.onEnd);
  currentAudio = audio;

  void audio.play().catch(() => speakWithDeviceVoice(text, generation, options?.onEnd));
  return true;
}

export function stopSpeaking() {
  speechGeneration += 1;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.removeAttribute("src");
    currentAudio.load();
  }
  currentAudio = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}
