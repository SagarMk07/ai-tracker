import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateWeeklyAccountabilitySummary } from "@/lib/openai";
import { PersonalityMode } from "@/types";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const personality = (body.personalityMode as PersonalityMode) || "tactical";

    // Date range: last 7 days
    const now = new Date();
    const info = new Date(now);
    info.setDate(now.getDate() - 7);
    const startDate = info.toISOString();

    // Fetch sessions
    const { data: sessions } = await supabase
      .from("focus_sessions")
      .select("duration_minutes, status, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate);

    // Fetch distractions
    const { count: distractionCount } = await supabase
      .from("distraction_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("occurred_at", startDate);

    const typedSessions = sessions || [];

    // Calculate metrics
    const totalMinutes = typedSessions
      .filter(s => s.status === "completed")
      .reduce((sum, s) => sum + s.duration_minutes, 0);

    const completionRate = typedSessions.length > 0
      ? Math.round((typedSessions.filter(s => s.status === "completed").length / typedSessions.length) * 100)
      : 0;

    // Calculate streak (basic implementation)
    // A robust streak would require querying daily records, 
    // but for now we'll approximate based on presence of sessions in last few days.
    // Let's rely on performance_metrics table if we were updating it, 
    // but since we are computing on fly:
    const streakDays = new Set(
      typedSessions
        .filter(s => s.status === "completed")
        .map(s => new Date(s.created_at).toDateString())
    ).size;

    const summary = await generateWeeklyAccountabilitySummary({
      weeklyFocusHours: Math.round(totalMinutes / 60 * 10) / 10,
      completionRate,
      distractionCount: distractionCount || 0,
      streakDays,
      personality
    });

    return NextResponse.json(summary);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
