import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase server env vars are missing");
  }

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // no-op in readonly cookie contexts
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // no-op in readonly cookie contexts
        }
      },
    },
  });
}

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { user, supabase };
}

export async function ensureUserProfile(input: { supabase: any; user: User; personalityMode?: "soft" | "tactical" | "ruthless" }) {
  const { supabase, user, personalityMode } = input;
  const payload = {
    id: user.id,
    email: user.email ?? null,
    full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    ...(personalityMode ? { personality_mode: personalityMode } : {}),
  };

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceUrl && serviceKey) {
    const admin = createClient(serviceUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await admin.from("users").upsert(payload, { onConflict: "id" });
    if (error) {
      if (error.message.includes("personality_mode")) {
        throw new Error("Database schema is missing users.personality_mode. Run supabase/fix_users_rls_and_backfill.sql.");
      }
      throw new Error(`Unable to sync user profile (service role): ${error.message}`);
    }
    return;
  }

  const { error } = await supabase.from("users").upsert(
    {
      ...payload,
    },
    { onConflict: "id" },
  );

  if (error) {
    if (error.message.includes("personality_mode")) {
      throw new Error("Database schema is missing users.personality_mode. Run supabase/fix_users_rls_and_backfill.sql.");
    }
    throw new Error(`Unable to sync user profile: ${error.message}. Add SUPABASE_SERVICE_ROLE_KEY to server env or fix users RLS policies.`);
  }
}
