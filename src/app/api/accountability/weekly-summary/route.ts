import { NextResponse } from "next/server";
import { requireUser } from "@/services/supabaseServer";
import { generateWeeklyAccountabilitySummary } from "@/services/aiClient";
import type { PersonalityMode } from "@/types";
import { loadWeeklyAccountabilityInput } from "./_metrics";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const requestedMode = body.personalityMode as PersonalityMode | undefined;

    const metrics = await loadWeeklyAccountabilityInput(user, supabase);
    const personality = requestedMode || metrics.personalityMode;

    let summary = {
      summary: "Quota fallback: Focus execution is being tracked. Keep sessions short, finish strongly, and review daily.",
      priorities: [
        "Protect one non-negotiable deep-work block per day",
        "Cap each block to a realistic duration",
        "End each session with one concrete next action",
      ],
      riskAlert: "AI quota unavailable. Weekly coaching switched to deterministic fallback.",
    };

    try {
      summary = await generateWeeklyAccountabilitySummary({
        weeklyFocusHours: metrics.weeklyFocusHours,
        completionRate: metrics.completionRate,
        distractionCount: metrics.distractionCount,
        streakDays: metrics.streakDays,
        incompleteSessions: metrics.incompleteSessions,
        personality,
      });
    } catch (aiError) {
      console.error("Weekly summary generation failed, using fallback:", aiError);
    }

    const trendScore = Math.max(
      0,
      Math.min(100, metrics.completionRate - metrics.distractionCount * 0.7 + metrics.streakDays * 2 - metrics.incompleteSessions * 4),
    );

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 7);

    await supabase.from("performance_metrics").upsert(
      {
        user_id: user.id,
        week_start: weekStart.toISOString().slice(0, 10),
        total_focus_minutes: Math.round(metrics.weeklyFocusHours * 60),
        completed_sessions: metrics.completedSessions,
        completion_rate: metrics.completionRate,
        distraction_count: metrics.distractionCount,
        streak_days: metrics.streakDays,
        trend_score: trendScore,
        weekly_summary: summary.summary,
      },
      {
        onConflict: "user_id,week_start",
      },
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
