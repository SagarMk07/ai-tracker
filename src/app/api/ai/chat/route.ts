import { openai } from "@/lib/openai";
import { createServerClientComponent } from "@/lib/supabase/server";
import { logAICall } from "@/lib/ai-logger";

export async function POST(req: Request) {
    console.log("Chat API: Received request");
    try {
        const body = await req.json();
        const { messages, context } = body;

        if (!messages || !context) {
            console.error("Chat API Error: Missing messages or context");
            return new Response(JSON.stringify({ error: "Missing messages or context" }), { status: 400 });
        }

        // ... rest of the setup logic
        const toolsList = context.tools?.map((t: any) => t.name).join(", ") || "None";
        const workflowsList = context.workflows?.map((w: any) => w.name).join(", ") || "None";

        const systemPrompt = `You are the AI Strategy Assistant for the AI Tracker platform. 
        Your goal is to help users optimize their AI workflows and discover better ways to use their tools.

        CONTEXT:
        - Current Tools: ${toolsList}
        - Active Workflows: ${workflowsList}
        - User: ${context.userProfile?.email || "User"}

        GUIDELINES:
        - Be insightful, proactive, and strategic.
        - Suggest specific integrations between their existing tools.
        - If they ask about a workflow, offer ways to improve it using AI.
        - Keep responses relatively concise but valuable.
        - If they mention a tool they don't have, cross-reference it with their existing stack.`;

        console.log("Chat API: Creating completion...");
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                let fullResponse = "";
                try {
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            fullResponse += content;
                            controller.enqueue(encoder.encode(content));
                        }
                    }

                    // Background Logging
                    const supabase = await createServerClientComponent();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await logAICall({
                            userId: user.id,
                            prompt: messages[messages.length - 1].content,
                            response: fullResponse,
                            modelUsed: "gpt-4o"
                        });
                    }
                } catch (streamError) {
                    console.error("Chat Stream Error:", streamError);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream);
    } catch (error: any) {
        console.error("Chat API CRASH:", error);
        return new Response(JSON.stringify({
            error: error.message || "Internal Server Error",
            details: error.stack
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
