import { OpenAI } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey === "your_openai_api_key_here") {
    console.error("CRITICAL: OPENAI_API_KEY is missing or invalid in .env.local");
}

export const openai = new OpenAI({
    apiKey: apiKey || "dummy_key_for_build",
});

export async function generateSuggestion(prompt: string) {
    const res = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
    });
    return res.choices[0].message?.content;
}

export interface WorkflowRecommendation {
    name: string;
    description: string;
    trigger: string;
    actions: { type: string; description: string }[];
}

export async function generateWorkflowRecommendations(toolNames: string[]): Promise<WorkflowRecommendation[]> {
    const prompt = `Given these AI tools: ${toolNames.join(", ")}, suggest 3 creative workflows that integrate them. 
    Return the response as a JSON array of objects with the following structure:
    [{ "name": "string", "description": "string", "trigger": "string", "actions": [{ "type": "string", "description": "string" }] }]`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // or "gpt-3.5-turbo"
            messages: [
                { role: "system", content: "You are an expert AI architect who designs efficient workflows using modern AI tools." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) return [];

        const parsed = JSON.parse(content);
        // The AI might wrap the array in a key, let's normalize
        const workflows = Array.isArray(parsed) ? parsed : parsed.workflows || Object.values(parsed)[0];

        return Array.isArray(workflows) ? workflows : [];
    } catch (error) {
        console.error("Error generating workflow recommendations:", error);
        return [];
    }
}
