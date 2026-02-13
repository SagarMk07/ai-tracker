import { TaskBoard } from "@/components/dashboard/task-board";
import { AIChatCoach } from "@/components/dashboard/ai-chat-coach";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Check, Trash2, ArrowRight, TrendingUp, Calendar, Zap, Settings } from "lucide-react";
import { createServerClientComponent } from "@/lib/supabase/server";
import { FocusSession } from "@/types";
import { calculateStats } from "@/lib/stats-calculator";

export default async function DashboardPage() {
    const supabase = createServerClientComponent();

    // Fetch tasks
    const { data: tasks } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

    // Fetch user and stats (Parallelize for performance)
    const { data: { user } } = await supabase.auth.getUser();

    let stats = {
        integrityScore: 85, // Default/Mock
        totalFocusMinutes: 0,
        sessionsCompleted: 0,
        streakDays: 0
    };

    let userProfile: any = null;

    if (user) {
        // Fetch User Profile for Integrity Score
        const { data: profile } = await supabase.from("users").select("focus_integrity_score, email").eq("id", user.id).single();
        userProfile = profile;
        if (profile) stats.integrityScore = profile.focus_integrity_score;

        // Fetch Sessions for calculation using date range (last 7 days for now)
        const { data: sessions } = await supabase.from("focus_sessions")
            .select("*")
            .eq("user_id", user.id)
            .gte("started_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (sessions) {
            const calculated = calculateStats(sessions);
            stats.sessionsCompleted = calculated.sessionsCompleted;
            stats.totalFocusMinutes = calculated.totalFocusMinutes;
            stats.streakDays = calculated.streakDays;
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">
                            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user?.email?.split("@")[0] || "Guardian"}
                        </h1>
                        <p className="text-slate-400 mt-1">Ready to sync intention with action?</p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white" asChild>
                        <Link href="/settings">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
                {/* Stats Overview */}
                <section>
                    <StatsOverview {...stats} />
                </section>

                {/* Task Board */}
                <section className="h-full">
                    <TaskBoard initialTasks={tasks || []} />
                </section>
            </div>

            {/* Floating AI Coach - Now Context Aware */}
            <AIChatCoach context={{ tasks: tasks || [], stats, userProfile }} />
        </main>
    );
}
