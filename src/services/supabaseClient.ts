import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // In Next.js, NEXT_PUBLIC_ variables are replaced at build time
  // We need to ensure they're available in the browser
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url || !key) {
    console.error("Supabase env vars:", {
      url: url ? "present" : "missing",
      key: key ? "present" : "missing"
    });
    throw new Error("Supabase client env vars are missing. Check your .env.local file and restart the dev server.");
  }

  return createBrowserClient(url, key);
};
