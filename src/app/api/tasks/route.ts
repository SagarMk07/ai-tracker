import { NextResponse } from "next/server";
import { requireUser } from "@/services/supabaseServer";

export async function POST(request: Request) {
    try {
        const { user, supabase } = await requireUser();
        const body = await request.json();
        const { title, description, difficultyScore, estimatedMinutes, subTasks, suggestedTime } = body;

        if (!title) {
            return NextResponse.json({ error: "Title required" }, { status: 400 });
        }

        const { error } = await supabase.from("tasks").insert({
            user_id: user.id,
            title,
            description: description || null,
            difficulty_score: difficultyScore || null,
            estimated_minutes: estimatedMinutes || null,
            suggested_time: suggestedTime || null,
            ai_breakdown: subTasks || null,
            status: "todo",
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
