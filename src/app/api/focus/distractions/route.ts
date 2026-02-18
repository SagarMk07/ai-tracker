import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const { user, supabase } = await requireUser();
        const body = await request.json();
        const { sessionId, type, notes } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        const { error } = await supabase.from("distraction_logs").insert({
            user_id: user.id,
            session_id: sessionId,
            distraction_type: type || "internal",
            notes: notes || null,
            occurred_at: new Date().toISOString(),
        });

        if (error?.code === "PGRST205" && error.message?.includes("distraction_logs")) {
            // Legacy DB missing distraction_logs table: keep session flow non-blocking.
            return NextResponse.json({ ok: true, skipped: "distraction_logs_missing" });
        }

        if (error) {
            console.error("Distraction log error:", error);
            return NextResponse.json({ error: "Failed to log distraction" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
