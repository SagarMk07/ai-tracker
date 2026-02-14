import { createServerClientComponent } from "./supabase/server";

export async function logAICall({
    userId,
    prompt,
    response,
    tokensUsed,
    modelUsed
}: {
    userId: string;
    prompt: string;
    response?: string;
    tokensUsed?: number;
    modelUsed?: string;
}) {
    const supabase = await createServerClientComponent();

    try {
        const { error } = await supabase.from("ai_logs").insert({
            user_id: userId,
            prompt,
            response,
            tokens_used: tokensUsed,
            model_used: modelUsed,
        });

        if (error) {
            console.error("Error logging AI call (Supabase):", error);
        }
    } catch (e) {
        console.error("AI Logger CRASH:", e);
    }
}
