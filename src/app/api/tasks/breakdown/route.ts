import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateTaskIntelligence } from "@/lib/openai";
import type { PersonalityMode } from "@/types";

export async function POST(request: Request) {
    try {
        await requireUser();
        const body = await request.json();
        const { goal, availableWindows, personalityMode } = body;

        if (!goal) {
            return NextResponse.json({ error: "Goal required" }, { status: 400 });
        }

        let intelligence = {
            difficultyScore: 6,
            suggestedTime: "09:00-11:00",
            focusBlocks: [
                { title: "Define the output", minutes: 20, reason: "Remove ambiguity before execution." },
                { title: "Deep work block", minutes: 60, reason: "Push core progress." },
                { title: "Review and next action", minutes: 20, reason: "Close loop with momentum." },
            ],
        };

        try {
            intelligence = await generateTaskIntelligence({
                goal,
                availableWindows,
                personality: (personalityMode as PersonalityMode) || "tactical"
            });
        } catch (aiError) {
            console.error("Task intelligence generation failed, using fallback:", aiError);
        }

        return NextResponse.json(intelligence);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
