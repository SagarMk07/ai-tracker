import { requireUser } from "@/services/supabaseServer";
import type { UserProfile } from "@/types";
import { PersonalitySelector } from "@/components/analytics/personality-selector";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const { user, supabase } = await requireUser();
  const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
  const profile = data as UserProfile | null;

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-[1200px] gap-6">
        <AppSidebar />

        <div className="flex-1 space-y-5">
          <header>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Settings</p>
            <h1 className="mt-2 text-3xl">Account and Coaching</h1>
          </header>

          <Card className="space-y-4 p-5">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Signed in as</p>
              <p className="mt-1 text-lg">{profile?.email || user.email}</p>
            </div>

            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost">Sign out</Button>
            </form>
          </Card>

          <PersonalitySelector currentMode={profile?.personality_mode || "tactical"} />
        </div>
      </div>
    </main>
  );
}
