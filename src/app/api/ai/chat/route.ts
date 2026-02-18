import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { requireUser } from "@/services/supabaseServer";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { user } = await requireUser();
        const { messages } = await req.json();

        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: `You are Focus Guardian AI. You are a tactical execution coach.
      - User: ${user.email}
      - Tone: Concise, professional, action-oriented.
      - Goal: Help the user blocked on tasks, clarify intentions, or break down problems.
      - Constraints: Keep answers under 3 sentences unless asked for a detailed plan.
      - Do not be a generic chatbot. Be a productivity partner.`,
            messages,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Chat error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
