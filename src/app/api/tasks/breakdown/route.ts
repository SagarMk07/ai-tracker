import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/server";
import { generateTaskIntelligence } from "@/lib/openai";
import { PersonalityMode } from "@/types";

export async function POST(request: Request) {
    try {
        const { user } = await requireUser();
        const body = await request.json();
        const { goal, availableWindows, personalityMode } = body;

        if (!goal) {
            return NextResponse.json({ error: "Goal required" }, { status: 400 });
        }

        const intelligence = await generateTaskIntelligence({
            goal,
            availableWindows,
            personality: (personalityMode as PersonalityMode) || "tactical"
        });

        return NextResponse.json(intelligence);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
