import { useSyncExternalStore } from "react";
import { loadMistakes, saveMistake, removeMistakeCloud, clearMistakesCloud as clearMistakesCloudFn } from "@/lib/cloud";

export type MistakeKind = "dictation" | "quiz";

export interface Mistake {
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
const listeners = new Set<() => void>();
let cache: Mistake[] | null = null;
const EMPTY: Mistake[] = [];

function read(): Mistake[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Mistake[];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: Mistake[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach(l => l());
}

export function mergeMistake(list: Mistake[], entry: Omit<Mistake, "id" | "count" | "lastAt">, now: number): Mistake[] {
  const id = `${entry.kind}:${entry.word.toLowerCase()}`;
  const existing = list.find(m => m.id === id);
  if (existing) {
    return [{ ...existing, ...entry, count: existing.count + 1, lastAt: now }, ...list.filter(m => m.id !== id)];
  }
  return [{ ...entry, id, count: 1, lastAt: now }, ...list];
}

export function addMistake(entry: Omit<Mistake, "id" | "count" | "lastAt">) {
  const next = mergeMistake(read(), entry, Date.now());
  write(next);
  const saved = next[0];
  if (saved) void pushMistake(saved);
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
  try {
    await saveMistake({
      data: { id: m.id, kind: m.kind, word: m.word, meaning: m.meaning, yourAnswer: m.yourAnswer, ...(m.lessonId ? { lessonId: m.lessonId } : {}), count: m.count, lastAt: m.lastAt },
    });
  } catch {
    /* 未登录或网络错误时只保留本地 */
  }
}

let syncing = false;

/** 登录后调用：把云端错题拉下来与本地合并，并把本地独有的推上去。 */
export async function syncMistakesFromCloud() {
  if (syncing || typeof window === "undefined") return;
  syncing = true;
  try {
    const remote = await loadMistakes();
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
      });
    }
    const localOnly: Mistake[] = [];
    for (const m of local) {
      const r = byId.get(m.id);
      if (!r) {
        localOnly.push(m);
        byId.set(m.id, m);
      } else if (m.count > r.count || m.lastAt > r.lastAt) {
        const merged = { ...r, count: Math.max(r.count, m.count), lastAt: Math.max(r.lastAt, m.lastAt) };
        byId.set(m.id, merged);
        localOnly.push(merged);
      }
    }
    write([...byId.values()].sort((a, b) => b.lastAt - a.lastAt));
    for (const m of localOnly) await pushMistake(m);
  } catch {
    /* 未登录时忽略 */
  } finally {
    syncing = false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMistakes(): Mistake[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
