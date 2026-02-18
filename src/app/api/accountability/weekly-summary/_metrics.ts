import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function loadWeeklyAccountabilityInput(user: User, supabase: SupabaseClient) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const startDate = weekStart.toISOString();

  const [{ data: sessions }, { count: distractionCount }, { data: profile }] = await Promise.all([
    supabase
      .from("focus_sessions")
      .select("duration_minutes, status, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate),
    supabase
      .from("distraction_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("occurred_at", startDate),
    supabase.from("users").select("personality_mode").eq("id", user.id).single(),
  ]);

  const typedSessions = sessions || [];
  const completedSessions = typedSessions.filter((session) => session.status === "completed");
  const incompleteSessions = typedSessions.filter((session) => session.status === "abandoned").length;

  const totalMinutes = completedSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
  const completionRate = typedSessions.length > 0 ? Math.round((completedSessions.length / typedSessions.length) * 100) : 0;

  const completedDays = new Set(completedSessions.map((session) => new Date(session.created_at).toISOString().slice(0, 10)));

  let streakDays = 0;
  const cursor = new Date();
  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    weeklyFocusHours: Math.round((totalMinutes / 60) * 10) / 10,
    completedSessions: completedSessions.length,
    totalSessions: typedSessions.length,
    completionRate,
    distractionCount: distractionCount || 0,
    streakDays,
    incompleteSessions,
    personalityMode: profile?.personality_mode || "tactical",
  };
}
