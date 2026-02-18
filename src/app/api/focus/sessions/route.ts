import { NextResponse } from "next/server";
import { ensureUserProfile, requireUser } from "@/services/supabaseServer";
import { generateIntentionStatement } from "@/services/aiClient";
import type { PersonalityMode } from "@/types";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    await ensureUserProfile({ supabase, user });
    const body = await request.json();
    const goal = String(body.goal || "").trim();
    const durationMinutes = Number(body.durationMinutes || 0);
    const riskFactors = Array.isArray(body.riskFactors) ? body.riskFactors.map(String) : [];

    if (!goal || durationMinutes < 5 || durationMinutes > 240) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { data: profile } = await supabase.from("users").select("personality_mode").eq("id", user.id).single();

    let intention = `I will complete "${goal}" with full focus for ${durationMinutes} minutes.`;
    try {
      intention = await generateIntentionStatement({
        goal,
        durationMinutes,
        riskFactors,
        personality: (profile?.personality_mode || "tactical") as PersonalityMode,
      });
    } catch (aiError) {
      console.error("Intention generation failed, using fallback:", aiError);
    }

    let data: { id: string } | null = null;
    let error: { message?: string } | null = null;
    let includeLegacyIntent = false;
    let includeLegacyDurationSeconds = false;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const payload: Record<string, unknown> = {
        user_id: user.id,
        goal,
        duration_minutes: durationMinutes,
        risk_factors: riskFactors,
        intention,
        status: "in_progress",
        started_at: new Date().toISOString(),
      };

      if (includeLegacyIntent) {
        payload.intent = intention;
      }

      if (includeLegacyDurationSeconds) {
        payload.duration_seconds = durationMinutes * 60;
      }

      const result = await supabase.from("focus_sessions").insert(payload).select("id").single();
      data = result.data;
      error = result.error;

      if (!error) {
        break;
      }

      const message = error.message || "";
      if (message.includes('column "intent"') && message.includes("not-null")) {
        includeLegacyIntent = true;
      }
      if (message.includes('column "duration_seconds"') && message.includes("not-null")) {
        includeLegacyDurationSeconds = true;
      }
    }

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Unable to create session" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data.id, intention });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create session" }, { status: 500 });
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

    const { data: session } = await supabase
      .from("focus_sessions")
      .select("started_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    const endedAt = new Date();
    const actualDurationSeconds = session?.started_at
      ? Math.max(0, Math.floor((endedAt.getTime() - new Date(session.started_at).getTime()) / 1000))
      : null;

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status,
        ended_at: endedAt.toISOString(),
        actual_duration_seconds: actualDurationSeconds,
      })
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
