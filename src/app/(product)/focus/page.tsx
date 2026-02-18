import { redirect } from "next/navigation";
import { ImmersiveSession } from "@/features/focus/components/immersive-session";
import { requireUser } from "@/services/supabaseServer";
import type { FocusSession } from "@/types";

export const dynamic = "force-dynamic";

export default async function FocusPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { user, supabase } = await requireUser();
  const { session: sessionId } = await searchParams;

  let query = supabase.from("focus_sessions").select("*").eq("user_id", user.id);
  if (sessionId) {
    query = query.eq("id", sessionId);
  } else {
    query = query.in("status", ["in_progress"]).order("created_at", { ascending: false }).limit(1);
  }

  const { data } = await query;

  const session = (data?.[0] || null) as FocusSession | null;

  if (!session) {
    redirect("/dashboard");
  }

  return (
    <ImmersiveSession
      sessionId={session.id}
      goal={session.goal}
      intention={session.intention || `Focus on ${session.goal}`}
      durationMinutes={session.duration_minutes}
    />
  );
}
