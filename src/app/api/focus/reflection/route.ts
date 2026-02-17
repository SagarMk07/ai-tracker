import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateSessionReflection } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const { sessionId, rating, feedback } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Fetch session details + distractions
    const { data: session } = await supabase
      .from("focus_sessions")
      .select(`
            *,
            distraction_logs (
                distraction_type,
                notes
            )
        `)
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Generate AI Reflection
    const aiReflection = await generateSessionReflection({
      goal: session.goal,
      durationMinutes: session.duration_minutes,
      completed: session.status === "completed",
      distractions: session.distraction_logs || [],
      personality: "tactical" // TODO: Fetch from user profile
    });

    const { error } = await supabase.from("session_reflections").insert({
      session_id: sessionId,
      user_id: user.id,
      user_rating: rating || null,
      user_feedback: feedback || null,
      ai_feedback: aiReflection.summary,
      // We could store wins/blockers/nextAction if we added columns, 
      // but for now we'll just store the summary in ai_feedback 
      // or extend the table later.
      // Let's stick to the current schema: ai_feedback text.
    });

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
