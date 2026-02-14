import { supabaseClient } from "./supabaseClient";

// Only pure data fetching logic here
export async function getTools(userId: string) {
    try {
        const { data, error } = await supabaseClient
            .from("tools")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            console.error("Supabase getTools Error:", error);
            throw new Error(error.message);
        }
        return data;
    } catch (e: any) {
        throw new Error(e.message || "Failed to fetch tools");
    }
}
