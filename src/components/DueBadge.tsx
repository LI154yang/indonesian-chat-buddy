import { useMistakes } from "@/lib/mistakes";
import { isReviewDue, useReviewClock } from "@/lib/review";

export function DueBadge() {
  const now = useReviewClock();
  const due = useMistakes().filter(m => now > 0 && isReviewDue(m, now)).length;
  if (!due) return null;
  return <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground" aria-label={`${due} 个待复习`}>{due}</span>;
}
