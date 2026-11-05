export interface Attempt { lessonId: string | null; correct: number; total: number; at: number }
export interface MistakeLite { lastAt: number; masteredAt: number | null }

const DAY = 86_400_000;
export const PASS_RATE = 0.6;

function dayKey(t: number, tzOffsetMin: number) {
  return Math.floor((t - tzOffsetMin * 60_000) / DAY);
}

/** Consecutive days with activity ending today (or yesterday, so the streak survives until tonight). */
export function studyStreak(times: number[], now: number, tzOffsetMin = 0): number {
  const days = new Set(times.map(t => dayKey(t, tzOffsetMin)));
  let d = dayKey(now, tzOffsetMin);
  if (!days.has(d)) d -= 1;
  let n = 0;
  while (days.has(d)) { n++; d--; }
  return n;
}

/** Best score per lesson; a lesson counts as completed at ≥60%. */
export function lessonProgress(attempts: Attempt[]) {
  const best = new Map<string, number>();
  for (const a of attempts) {
    if (!a.lessonId || a.total <= 0) continue;
    best.set(a.lessonId, Math.max(best.get(a.lessonId) ?? 0, a.correct / a.total));
  }
  return best;
}

/** Open (not yet graduated) mistakes at the end of each of the last `weeks` weeks. */
export function openMistakeTrend(mistakes: MistakeLite[], now: number, weeks = 6) {
  return Array.from({ length: weeks }, (_, i) => {
    const end = now - (weeks - 1 - i) * 7 * DAY;
    const open = mistakes.filter(m => m.lastAt <= end && (m.masteredAt === null || m.masteredAt > end)).length;
    return { label: i === weeks - 1 ? "本周" : `${weeks - 1 - i}周前`, open };
  });
}
