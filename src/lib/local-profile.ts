import { useSyncExternalStore } from "react";
import type { Attempt } from "@/lib/progress";

const STORAGE_KEY = "ngobrol-local-learning-profile-v1";

export interface LocalCoachResult {
  lessonId: string | null;
  prompt: string;
  answer: string;
  feedback: string;
  at: number;
}

export interface LocalProfile {
  name: string;
  attempts: Attempt[];
  coachResults: LocalCoachResult[];
}

const EMPTY_PROFILE: LocalProfile = { name: "学习者", attempts: [], coachResults: [] };
const listeners = new Set<() => void>();
let cache: LocalProfile | null = null;

function isAttempt(value: unknown): value is Attempt {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Attempt>;
  return (item.lessonId === null || typeof item.lessonId === "string")
    && Number.isFinite(item.correct)
    && Number.isFinite(item.total)
    && Number.isFinite(item.at);
}

function isCoachResult(value: unknown): value is LocalCoachResult {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<LocalCoachResult>;
  return (item.lessonId === null || typeof item.lessonId === "string")
    && typeof item.prompt === "string"
    && typeof item.answer === "string"
    && typeof item.feedback === "string"
    && Number.isFinite(item.at);
}

function readProfile(): LocalProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") {
      cache = EMPTY_PROFILE;
      return cache;
    }
    const stored = parsed as Partial<LocalProfile>;
    cache = {
      name: typeof stored.name === "string" ? stored.name.slice(0, 40) : EMPTY_PROFILE.name,
      attempts: Array.isArray(stored.attempts) ? stored.attempts.filter(isAttempt).slice(-1000) : [],
      coachResults: Array.isArray(stored.coachResults) ? stored.coachResults.filter(isCoachResult).slice(-500) : [],
    };
  } catch {
    cache = EMPTY_PROFILE;
  }
  return cache;
}

function notify() {
  listeners.forEach(listener => listener());
}

export function getLocalProfile() {
  return readProfile();
}

export function saveLocalProfile(profile: LocalProfile) {
  const next: LocalProfile = {
    name: profile.name.trim().slice(0, 40) || EMPTY_PROFILE.name,
    attempts: profile.attempts.slice(-1000),
    coachResults: profile.coachResults.slice(-500).map(result => ({
      ...result,
      prompt: result.prompt.slice(0, 1000),
      answer: result.answer.slice(0, 500),
      feedback: result.feedback.slice(0, 8000),
    })),
  };
  cache = next;
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Keep the current session usable if browser storage is unavailable. */
  }
  notify();
}

export function recordLocalQuizAttempt(attempt: Attempt) {
  const profile = readProfile();
  saveLocalProfile({ ...profile, attempts: [...profile.attempts, attempt] });
}

export function recordLocalCoachResult(result: LocalCoachResult) {
  const profile = readProfile();
  saveLocalProfile({ ...profile, coachResults: [...profile.coachResults, result] });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cache = null;
    notify();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", handleStorage);
  };
}

export function useLocalProfile() {
  return useSyncExternalStore(subscribe, readProfile, () => EMPTY_PROFILE);
}