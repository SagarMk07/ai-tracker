import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateIntentionStatement } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const goal = String(body.goal || "").trim();
    const durationMinutes = Number(body.durationMinutes || 0);
    const riskFactors = Array.isArray(body.riskFactors) ? body.riskFactors.map(String) : [];
    const personalityMode = body.personalityMode || "tactical";

    if (!goal || durationMinutes < 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const intention = await generateIntentionStatement({
      goal,
      durationMinutes,
      riskFactors,
      personality: personalityMode,
    });

    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: user.id,
        goal,
        duration_minutes: durationMinutes,
        risk_factors: riskFactors,
        intention: intention,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data.id, intention });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const sessionId = String(body.sessionId || "");
    const status = body.status;

    if (!sessionId || !["completed", "abandoned"].includes(status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { error } = await supabase
      .from("focus_sessions")
      .update({ status, ended_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
