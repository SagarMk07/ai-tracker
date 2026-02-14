import { openai } from "@/lib/openai";
import { createServerClientComponent } from "@/lib/supabase/server";
import { logAICall } from "@/lib/ai-logger";

export async function POST(req: Request) {
    console.log("Refine Workflow API: START");
    try {
        const body = await req.json();
        const { workflow } = body;

        if (!workflow) {
            console.error("Refine Workflow Error: Missing workflow data");
            return new Response(JSON.stringify({ error: "Workflow data is required" }), { status: 400 });
        }

        const prompt = `Review and refine this AI workflow. Improve the trigger and actions to be more efficient and clear.
        Current Workflow:
        Name: ${workflow.name}
        Description: ${workflow.description}
        Trigger: ${workflow.trigger}
        Actions: ${JSON.stringify(workflow.actions)}

        Return the response as a JSON object with the structure:
        { "name": "string", "description": "string", "trigger": "string", "actions": [{ "type": "string", "description": "string" }] }`;

        console.log("Refine Workflow API: Requesting AI...");
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert AI architect who optimizes automation workflows." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const refinedWorkflow = JSON.parse(response.choices[0].message?.content || "{}");

        const supabase = await createServerClientComponent();
        const { data: { user } } = await supabase.auth.getUser();

        // Log the AI call
        if (user) {
            await logAICall({
                userId: user.id,
                prompt,
                response: response.choices[0].message?.content || "",
                modelUsed: "gpt-4o"
            });
        }

        return new Response(JSON.stringify({ refinedWorkflow }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Refine Workflow API CRASH:", error);
        return new Response(JSON.stringify({
            error: error.message || "Internal Server Error",
            details: error.stack
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
