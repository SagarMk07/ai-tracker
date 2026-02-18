import { NextResponse } from "next/server";
import { ensureUserProfile, requireUser } from "@/services/supabaseServer";
import type { PersonalityMode } from "@/types";

export async function PATCH(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const mode = body.mode as PersonalityMode;

    if (!["soft", "tactical", "ruthless"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // ensureUserProfile already upserts personality_mode and will use service-role
    // client when available, so we avoid a second RLS-sensitive update call here.
    await ensureUserProfile({ supabase, user, personalityMode: mode });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
