import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { buildDashboardSnapshot } from "@/lib/metrics";
import type { FocusSession, PersonalityMode } from "@/types";
import { CreateSessionModal } from "@/components/session/create-session-modal";
import { SmartTaskInput } from "@/components/tasks/smart-task-input";
import { MetricCard } from "@/components/analytics/metric-card";
import { WeeklyFocusChart } from "@/components/analytics/weekly-focus-chart";
import { DistractionFrequency } from "@/components/analytics/distraction-frequency";
import { PerformanceTrend } from "@/components/analytics/performance-trend";
import { WeeklySummaryCard } from "@/components/analytics/weekly-summary-card";
import { PersonalitySelector } from "@/components/analytics/personality-selector";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function startOfDay(input: Date) {
  const next = new Date(input);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isoDay(input: Date) {
  return input.toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();
  const weekStart = startOfDay(new Date());
  weekStart.setDate(weekStart.getDate() - 6);

  const [profileResult, sessionsResult, distractionsResult, metricsResult, tasksResult] = await Promise.all([
    supabase.from("users").select("personality_mode").eq("id", user.id).single(),
    supabase
      .from("focus_sessions")
      .select("id,user_id,goal,duration_minutes,risk_factors,intention,status,started_at,ended_at,recovered,created_at,updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("distraction_logs")
      .select("distraction_type,occurred_at")
      .eq("user_id", user.id)
      .gte("occurred_at", weekStart.toISOString()),
    supabase
      .from("performance_metrics")
      .select("week_start,trend_score")
      .eq("user_id", user.id)
      .order("week_start", { ascending: false })
      .limit(4),
    supabase
      .from("tasks")
      .select("id,title,status,difficulty_score,estimated_minutes,created_at")
      .eq("user_id", user.id)
      .in("status", ["todo", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const personalityMode = (profileResult.data?.personality_mode || "tactical") as PersonalityMode;
  const rawSessions = (sessionsResult.data || []) as FocusSession[];
  const sessions: FocusSession[] = rawSessions.map((session) => {
    if (session.status !== "in_progress" || !session.started_at) {
      return session;
    }

    const elapsedMs = Date.now() - new Date(session.started_at).getTime();
    const overdueMs = elapsedMs - session.duration_minutes * 60 * 1000;

    if (overdueMs > 15 * 60 * 1000) {
      return { ...session, status: "abandoned" as const };
    }

    return session;
  });

  const staleIds = sessions.filter((session) => session.status === "abandoned" && !session.ended_at).map((session) => session.id);
  if (staleIds.length) {
    await supabase
      .from("focus_sessions")
      .update({ status: "abandoned", ended_at: new Date().toISOString(), recovered: true })
      .eq("user_id", user.id)
      .in("id", staleIds);
  }

  const distractions = distractionsResult.data || [];
  const snapshot = buildDashboardSnapshot(sessions, distractions.length);

  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dayMap = new Map<string, { day: string; minutes: number }>();

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    dayMap.set(isoDay(day), { day: dayFormatter.format(day), minutes: 0 });
  }

  for (const session of sessions) {
    if (session.status !== "completed" || !session.started_at) continue;

    const key = isoDay(new Date(session.started_at));
    const bucket = dayMap.get(key);
    if (bucket) {
      bucket.minutes += session.duration_minutes;
    }
  }

  const minutesByDay = Array.from(dayMap.values());
  const frequencyMap = new Map<string, number>();

  for (const distraction of distractions) {
    const label = distraction.distraction_type || "unknown";
    frequencyMap.set(label, (frequencyMap.get(label) || 0) + 1);
  }

  const distractionData = Array.from(frequencyMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const trendData = (metricsResult.data || [])
    .map((row) => ({
      week: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(row.week_start)),
      score: row.trend_score || 0,
    }))
    .reverse();

  if (!trendData.length) {
    trendData.push({ week: "This week", score: snapshot.trendScore });
  }

  const activeSession = sessions.find((session) => session.status === "in_progress");

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1400px] gap-6">
        <AppSidebar />

        <div className="flex-1 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Focus Guardian AI</p>
              <h1 className="mt-2 text-4xl">Execution Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              {activeSession ? (
                <Button asChild variant="primary" size="sm">
                  <Link href={`/focus?session=${activeSession.id}`}>Resume Session</Link>
                </Button>
              ) : null}
              <Button asChild variant="ghost" size="sm">
                <Link href="/settings">Settings</Link>
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="ghost" size="sm">Sign out</Button>
              </form>
            </div>
          </header>

          <section className="flex flex-wrap items-center gap-3">
            <CreateSessionModal personalityMode={personalityMode} />
            <p className="text-sm text-[var(--text-muted)]">Signed in as {user.email}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Weekly Focus" value={`${snapshot.weeklyFocusHours}h`} helper="Completed deep work" />
            <MetricCard label="Streak" value={`${snapshot.streakDays} days`} helper="Consecutive completion days" />
            <MetricCard label="Completion Rate" value={`${snapshot.completionRate}%`} helper="Completed vs planned sessions" />
            <MetricCard label="Distractions" value={`${snapshot.distractionCount}`} helper="Logged this week" />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <WeeklyFocusChart minutesByDay={minutesByDay} />
            <DistractionFrequency data={distractionData.length ? distractionData : [{ label: "none", count: 0 }]} />
            <PerformanceTrend data={trendData} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <WeeklySummaryCard personalityMode={personalityMode} />
            <div className="space-y-4">
              <PersonalitySelector currentMode={personalityMode} />
              <SmartTaskInput personalityMode={personalityMode} />
            </div>
          </section>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Open Execution Queue</h3>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Top 6</p>
            </div>
            <div className="mt-4 space-y-2">
              {(tasksResult.data || []).length ? (
                (tasksResult.data || []).map((task) => (
                  <article key={task.id} className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-secondary)]/45 p-3">
                    <p className="font-medium text-[var(--text-primary)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Status: {task.status} {task.estimated_minutes ? `- ${task.estimated_minutes} min` : ""}
                      {task.difficulty_score ? `- difficulty ${task.difficulty_score}/10` : ""}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No active tasks. Break down your next major goal below.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
