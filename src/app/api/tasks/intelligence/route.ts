import { NextResponse } from "next/server";
import { requireUser } from "@/services/supabaseServer";
import { streamWeeklyAccountabilityNarrative, generateWeeklyAccountabilitySummary, generateTaskIntelligence } from "@/services/aiClient";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const goal = String(body.goal || "").trim();
    const personalityMode = body.personalityMode || "tactical";

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    const intelligence = await generateTaskIntelligence({
      goal,
      personality: personalityMode,
    });

    await supabase.from("tasks").insert({
      user_id: user.id,
      title: goal,
      status: "todo",
      difficulty_score: intelligence.difficultyScore,
      suggested_time: intelligence.suggestedTime,
      ai_breakdown: intelligence.focusBlocks,
      estimated_minutes: intelligence.focusBlocks.reduce((sum, block) => sum + block.minutes, 0),
    });

    return NextResponse.json(intelligence);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate task intelligence" }, { status: 500 });
  }
}
