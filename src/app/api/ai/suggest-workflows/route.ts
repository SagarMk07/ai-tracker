import { NextResponse } from "next/server";
import { generateWorkflowRecommendations } from "@/lib/openai";
import { logAICall } from "@/lib/ai-logger";
import { createServerClientComponent } from "@/lib/supabase/server";

export async function POST(req: Request) {
    console.log("Suggest Workflows API: START");
    try {
        const { toolNames } = await req.json();
        const supabase = await createServerClientComponent();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("Suggest Workflows Error: Unauthorized");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!toolNames || toolNames.length === 0) {
            return NextResponse.json({ error: "No tool names provided" }, { status: 400 });
        }

        console.log("Suggest Workflows API: Generating for", toolNames);
        const recommendations = await generateWorkflowRecommendations(toolNames);

        // Log the AI call
        await logAICall({
            userId: user.id,
            prompt: `Generate workflows for: ${toolNames.join(", ")}`,
            response: JSON.stringify(recommendations),
            modelUsed: "gpt-4-turbo-preview"
        });

        return NextResponse.json({ recommendations });
    } catch (error: any) {
        console.error("Suggest Workflows API CRASH:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: error.stack
        }, { status: 500 });
    }
}
