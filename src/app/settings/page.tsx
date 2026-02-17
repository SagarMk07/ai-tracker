import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import type { UserProfile } from "@/types";
import { PersonalitySelector } from "@/components/analytics/personality-selector";

export default async function SettingsPage() {
  const { user, supabase } = await requireUser();
  const { data } = await supabase.from("users").select("*").eq("id", user.id).single();

  const profile = data as UserProfile | null;

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Settings</p>
            <h1 className="text-3xl mt-2">Account and Coaching</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-600 px-4 py-2 text-sm">Back</Link>
        </header>

        <section className="panel p-5">
          <p className="text-sm text-slate-300">Signed in as</p>
          <p className="text-lg mt-1">{profile?.email || user.email}</p>
          <form action="/auth/signout" method="post" className="mt-4">
            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-950">Sign out</button>
          </form>
        </section>

        <PersonalitySelector currentMode={profile?.personality_mode || "tactical"} />
      </div>
    </main>
  );
}
