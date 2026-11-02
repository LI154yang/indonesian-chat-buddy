import { useSyncExternalStore } from "react";
import { loadMistakes, saveMistake, removeMistakeCloud, clearMistakesCloud as clearMistakesCloudFn } from "@/lib/cloud";
import { initialReview, resolveReview, type ReviewState } from "@/lib/review";

export type MistakeKind = "dictation" | "quiz";

export interface Mistake extends ReviewState {
  id: string;
  kind: MistakeKind;
  /** Indonesian text to replay */
  word: string;
  meaning: string;
  /** What the learner answered */
  yourAnswer: string;
  lessonId?: string;
  count: number;
  lastAt: number;
}

const KEY = "ngobrol-mistakes-v1";
let owner: string | null = null;
function storageKey() { return owner ? `${KEY}:${owner}` : KEY; }
const listeners = new Set<() => void>();
let cache: Mistake[] | null = null;
const EMPTY: Mistake[] = [];

function read(): Mistake[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = (JSON.parse(window.localStorage.getItem(storageKey()) ?? "[]") as Mistake[]).map(m => ({ ...initialReview(m.lastAt), ...m }));
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Mistake[]) {
  cache = next;
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach(l => l());
}

type MistakeEntry = Omit<Mistake, "id" | "count" | "lastAt" | keyof ReviewState>;

export function mergeMistake(list: Mistake[], entry: MistakeEntry, now: number): Mistake[] {
  const id = `${entry.kind}:${entry.word.toLowerCase()}`;
  const existing = list.find(m => m.id === id);
  if (existing) {
    return [{ ...existing, ...entry, ...initialReview(now), count: existing.count + 1, lastAt: now }, ...list.filter(m => m.id !== id)];
  }
  return [{ ...entry, ...initialReview(now), id, count: 1, lastAt: now }, ...list];
}

export function addMistake(entry: MistakeEntry) {
  const next = mergeMistake(read(), entry, Date.now());
  write(next);
  const saved = next[0];
  if (saved) void pushMistake(saved);
}

export function reviewMistake(id: string, correct: boolean, answer: string) {
  const current = read().find(m => m.id === id);
  if (!current || current.masteredAt !== null) return;
  const now = Date.now();
  const updated = { ...current, ...resolveReview(current, correct, now), ...(correct ? {} : { count: current.count + 1, lastAt: now, yourAnswer: answer }) };
  write(read().map(m => m.id === id ? updated : m));
  void pushMistake(updated);
}

export function setMistakeOwner(userId: string | null) {
  if (owner === userId) return;
  const guest = owner === null && userId ? read() : [];
  owner = userId;
  cache = null;
  const account = read();
  if (guest.length) {
    const ids = new Set(account.map(m => m.id));
    write([...account, ...guest.filter(m => !ids.has(m.id))]);
    window.localStorage.removeItem(KEY);
  } else listeners.forEach(l => l());
}

export function removeMistake(id: string) {
  write(read().filter(m => m.id !== id));
  void removeMistakeCloud({ data: { id } }).catch(() => {});
}

export function clearMistakes() {
  write([]);
  void clearMistakesCloudFn().catch(() => {});
}

// ---- 云端同步（登录后启用，失败时静默保留本地数据） ----

async function pushMistake(m: Mistake) {
  if (!owner) return;
  try {
    await saveMistake({
      data: { ...m },
    });
  } catch {
    /* 未登录或网络错误时只保留本地 */
  }
}

let syncingOwner: string | null = null;

/** 登录后调用：把云端错题拉下来与本地合并，并把本地独有的推上去。 */
export async function syncMistakesFromCloud() {
  if (!owner || syncingOwner === owner || typeof window === "undefined") return;
  const requestOwner = owner;
  syncingOwner = requestOwner;
  try {
    const remote = await loadMistakes();
    if (owner !== requestOwner) return;
    const local = read();
    const byId = new Map<string, Mistake>();
    for (const r of remote) {
      byId.set(r.id, {
        id: r.id,
        kind: r.kind === "quiz" ? "quiz" : "dictation",
        word: r.word,
        meaning: r.meaning,
        yourAnswer: r.your_answer,
        ...(r.lesson_id ? { lessonId: r.lesson_id } : {}),
        count: r.count,
        lastAt: new Date(r.last_at).getTime(),
        reviewStage: r.review_stage,
        nextReviewAt: r.next_review_at ? new Date(r.next_review_at).getTime() : null,
        masteredAt: r.mastered_at ? new Date(r.mastered_at).getTime() : null,
        reviewUpdatedAt: new Date(r.review_updated_at).getTime(),
      });
    }
    const localOnly: Mistake[] = [];
    for (const m of local) {
      const r = byId.get(m.id);
      if (!r) {
        localOnly.push(m);
        byId.set(m.id, m);
      } else if (m.reviewUpdatedAt > r.reviewUpdatedAt) {
        const merged = { ...m, count: Math.max(r.count, m.count) };
        byId.set(m.id, merged);
        localOnly.push(merged);
      }
    }
    write([...byId.values()].sort((a, b) => b.lastAt - a.lastAt));
    for (const m of localOnly) {
      if (owner !== requestOwner) return;
      await pushMistake(m);
    }
  } catch {
    /* 未登录时忽略 */
  } finally {
    if (syncingOwner === requestOwner) syncingOwner = null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMistakes(): Mistake[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
