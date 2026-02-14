import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase environment variables missing. Build will continue but runtime will fail unless provided.");
}

export const supabaseClient = createBrowserClient(url, key);
