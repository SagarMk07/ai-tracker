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

    if (!goal || durationMinutes < 5) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { data: profile } = await supabase.from("users").select("personality_mode").eq("id", user.id).single();

    const intention = await generateIntentionStatement({
      goal,
      durationMinutes,
      riskFactors,
      personality: profile?.personality_mode || "tactical",
    });

    return NextResponse.json({ intention });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate intention" }, { status: 500 });
  }
}
