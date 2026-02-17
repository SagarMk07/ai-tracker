import type { DashboardSnapshot, FocusSession } from "@/types";

export function buildDashboardSnapshot(sessions: FocusSession[], distractionCount: number): DashboardSnapshot {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const weeklySessions = sessions.filter((s) => new Date(s.created_at) >= weekAgo);
  const completed = weeklySessions.filter((s) => s.status === "completed");
  const minutes = completed.reduce((sum, s) => sum + s.duration_minutes, 0);
  const completionRate = weeklySessions.length ? (completed.length / weeklySessions.length) * 100 : 0;

  const sorted = [...sessions]
    .filter((s) => s.status === "completed" && s.started_at)
    .sort((a, b) => new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime());

  let streakDays = 0;
  const seen = new Set<string>();

  // Normalize dates to YYYY-MM-DD
  for (const session of sorted) {
    if (!session.started_at) continue;
    const key = new Date(session.started_at).toISOString().slice(0, 10);
    seen.add(key);
  }

  let cursor = new Date();
  const todayKey = cursor.toISOString().slice(0, 10);

  // If no session today, check if streak is alive from yesterday
  if (!seen.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (seen.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const trendScore = Math.max(0, Math.min(100, completionRate - distractionCount * 0.7 + streakDays * 2));

  return {
    weeklyFocusHours: Number((minutes / 60).toFixed(1)),
    streakDays,
    completionRate: Number(completionRate.toFixed(1)),
    distractionCount,
    trendScore: Number(trendScore.toFixed(1)),
  };
}
