import { requireUser } from "@/services/supabaseServer";
import { HistoryList } from "@/features/focus/components/history-list";
import { HistoryFilters } from "@/features/focus/components/history-filters";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { startOfDay, startOfWeek, startOfMonth, subDays } from "date-fns";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
    searchParams: { filter?: string };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
    const { user, supabase } = await requireUser();
    const filter = searchParams.filter || "all";

    let query = supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Apply filters
    const now = new Date();
    if (filter === "today") {
        query = query.gte("created_at", startOfDay(now).toISOString());
    } else if (filter === "week") {
        query = query.gte("created_at", startOfWeek(now).toISOString());
    } else if (filter === "month") {
        query = query.gte("created_at", startOfMonth(now).toISOString());
    }

    const { data: sessions, error } = await query;

    if (error) {
        console.error("Error fetching history:", error);
    }

    return (
        <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex max-w-[1400px] gap-6">
                <AppSidebar />

                <div className="flex-1 space-y-8">
                    <header className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Focus Guardian AI</p>
                            <h1 className="mt-2 text-4xl">Session History</h1>
                        </div>
                        <HistoryFilters />
                    </header>

                    <HistoryList sessions={sessions || []} />
                </div>
            </div>
        </main>
    );
}
