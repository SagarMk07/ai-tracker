import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { PersonalityMode } from "@/types";

export async function PATCH(request: Request) {
    try {
        const { user, supabase } = await requireUser();
        const body = await request.json();
        const mode = body.mode as PersonalityMode;

        if (!["soft", "tactical", "ruthless"].includes(mode)) {
            return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
        }

        const { error } = await supabase
            .from("users")
            .update({ personality_mode: mode })
            .eq("id", user.id);

        if (error) {
            return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
