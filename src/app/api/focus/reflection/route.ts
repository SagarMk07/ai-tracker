import { NextResponse } from "next/server";
import { requireUser } from "@/services/supabaseServer";
import { generateSessionReflection } from "@/services/aiClient";
import type { PersonalityMode } from "@/types";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const { sessionId, rating, feedback } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const [{ data: session }, { data: profile }] = await Promise.all([
      supabase
        .from("focus_sessions")
        .select(
          `
            goal,
            duration_minutes,
            status,
            distraction_logs (
              distraction_type,
              notes
            )
          `,
        )
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single(),
      supabase.from("users").select("personality_mode").eq("id", user.id).single(),
    ]);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const aiReflection = await generateSessionReflection({
      goal: session.goal,
      durationMinutes: session.duration_minutes,
      completed: session.status === "completed",
      distractions: session.distraction_logs || [],
      personality: (profile?.personality_mode || "tactical") as PersonalityMode,
    });

    const { error } = await supabase.from("session_reflections").upsert(
      {
        session_id: sessionId,
        user_id: user.id,
        summary: aiReflection.summary,
        wins: aiReflection.wins,
        blockers: aiReflection.blockers,
        next_action: aiReflection.nextAction,
        user_rating: rating || null,
        user_feedback: feedback || null,
      },
      {
        onConflict: "session_id",
      },
    );

    if (error) {
      console.error("Reflection insert error:", error);
      return NextResponse.json({ error: "Failed to save reflection" }, { status: 500 });
    }

    return NextResponse.json(aiReflection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
