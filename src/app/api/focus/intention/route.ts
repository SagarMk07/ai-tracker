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

    if (!goal || durationMinutes < 5) {
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

    return NextResponse.json({ intention });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate intention" }, { status: 500 });
  }
}
