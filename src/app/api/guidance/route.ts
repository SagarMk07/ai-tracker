import OpenAI from "openai";

export async function POST(req: Request) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        // Mock Guidance
        const stream = new ReadableStream({
            async start(controller) {
                const mockPhrases = [
                    "Stay with the task.",
                    "Return without judgment.",
                    "Breathe. Re-engage.",
                    "The work creates the flow.",
                    "One step at a time.",
                    "Focus is a muscle.",
                ];
                const text = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
                controller.enqueue(new TextEncoder().encode(text));
                controller.close();
            }
        });
        return new Response(stream);
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    const { context, duration, elapsed } = await req.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
            {
                role: "system",
                content: `You are the specific 'Focus Mentor' module of Focus Guardian AI.
            Your job is to provide ONE short sentence (max 12 words) to keep the user focused.
            
            Context: The user is in a deep work session.
            
            Examples:
            - "Stay with the task."
            - "Return without judgment."
            - "Breathe. Re-engage."
            - "The work creates the flow."
            
            Output ONLY the sentence. No quotes.`
            },
            {
                role: "user",
                content: `Session Context: Working on "${context}". Elapsed: ${elapsed}s / ${duration}s. Give me guidance.`
            }
        ],
        max_tokens: 50,
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
