let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechGeneration = 0;
let finishedGeneration = 0;

function finishSpeech(generation: number, onEnd?: () => void) {
  if (speechGeneration !== generation || finishedGeneration === generation) return;
  finishedGeneration = generation;
  currentAudio = null;
  currentUtterance = null;
  onEnd?.();
}

function supportsDeviceSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function speakWithDeviceVoice(text: string, generation: number, options?: { rate?: number; onEnd?: () => void }) {
  if (speechGeneration !== generation) return;
  if (!supportsDeviceSpeech()) {
    finishSpeech(generation, options?.onEnd);
    return;
  }
  if (currentUtterance) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.85;
  const idVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith("id"));
  if (idVoice) utterance.voice = idVoice;
  utterance.onend = () => finishSpeech(generation, options?.onEnd);
  utterance.onerror = () => finishSpeech(generation, options?.onEnd);
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function speakIndonesian(
  text: string,
  options?: { rate?: number; onEnd?: () => void }
): boolean {
  if (typeof window === "undefined") return false;
  const canPlayAudio = typeof Audio !== "undefined";
  if (!canPlayAudio && !supportsDeviceSpeech()) return false;

  stopSpeaking();
  const generation = ++speechGeneration;

  if (!canPlayAudio) {
    speakWithDeviceVoice(text, generation, options);
    return true;
  }

  let audio: HTMLAudioElement;
  try {
    audio = new Audio(`/api/audio?text=${encodeURIComponent(text)}`);
  } catch {
    speakWithDeviceVoice(text, generation, options);
    return true;
  }
  audio.preload = "auto";
  audio.onended = () => finishSpeech(generation, options?.onEnd);
  let fallbackStarted = false;
  const fallBackToSpeech = () => {
    if (speechGeneration !== generation || fallbackStarted) return;
    fallbackStarted = true;
    if (currentAudio === audio) {
      currentAudio = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    speakWithDeviceVoice(text, generation, options);
  };
  audio.onerror = fallBackToSpeech;
  currentAudio = audio;

  void audio.play().catch(fallBackToSpeech);
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
  return typeof window !== "undefined" && (typeof Audio !== "undefined" || supportsDeviceSpeech());
}
