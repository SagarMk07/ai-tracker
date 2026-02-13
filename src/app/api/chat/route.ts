import OpenAI from "openai";

export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        // Mock Mode for Demo/No-Key environments
        const stream = new ReadableStream({
            async start(controller) {
                const mockResponses = [
                    "Focus is not about doing more, but doing what matters. Let's break this down.",
                    "I notice you're looking for guidance. Start by defining the smallest next step.",
                    "Deep work requires a distraction-free environment. Have you silenced your notifications?",
                    "This is a mocked response because no API key was found. Configure OPENAI_API_KEY to unlock full intelligence.",
                ];
                const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

                // Simulate typing effect
                const encoder = new TextEncoder();
                const tokens = randomResponse.split(" ");

                for (const token of tokens) {
                    controller.enqueue(encoder.encode(token + " "));
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                controller.close();
            }
        });
        return new Response(stream);
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    const body = await req.json();
    const messages = body.messages || [];
    const context = body.context || {}; // { tasks: [], stats: {}, userProfile: {} }

    // Construct enriched system prompt
    const systemPrompt = `You are the Focus Guardian AI, an elite productivity strategist.
    Your goal is to help the user plan their day, prioritize tasks, and recover from distractions.

    CONTEXT:
    - User Name: ${context.userProfile?.email?.split('@')[0] || "User"}
    - Integrity Score: ${context.stats?.integrityScore || "Unknown"}%
    - Today's Tasks: ${context.tasks?.filter((t: any) => t.status === 'todo').map((t: any) => t.title).join(", ") || "None"}
    - Wishlist: ${context.tasks?.filter((t: any) => t.status === 'wishlist').length || 0} items

    Traits:
    - Calm, grounded authority.
    - Concise and actionable.
    - Never judgmental or shaming.
    - Focus on "deep work" principles (Cal Newport style).
    - Use data from CONTEXT to be specific.
    
    Do not be chatty. Get straight to the strategy.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        stream: true,
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            ...messages
        ],
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                }
            }
            controller.close();
        },
    });

    return new Response(stream);
}
