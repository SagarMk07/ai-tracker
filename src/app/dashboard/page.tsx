import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Bot, Zap, Settings, Layout, Layers } from "lucide-react";
import { createServerClientComponent } from "@/lib/supabase/server";
import { Tool, Workflow } from "@/types";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ToolList } from "@/components/tools/tool-list";
import { WorkflowList } from "@/components/workflows/workflow-list";
import { AIChatCoach } from "@/components/dashboard/ai-chat-coach";
import { LogoutButton } from "@/components/dashboard/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createServerClientComponent();

    // Fetch user defensively
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    // Fetch tools and workflows with basic safety
    const { data: tools, error: toolsError } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
    const { data: workflows, error: workflowsError } = await supabase.from("workflows").select("*").order("created_at", { ascending: false });

    if (toolsError) console.error("Dashboard: Tools fetch error:", {
        message: toolsError.message,
        code: toolsError.code,
        details: toolsError.details,
        hint: toolsError.hint
    });
    if (workflowsError) console.error("Dashboard: Workflows fetch error:", {
        message: workflowsError.message,
        code: workflowsError.code,
        details: workflowsError.details,
        hint: workflowsError.hint
    });

    const stats = {
        totalTools: tools?.length || 0,
        activeWorkflows: workflows?.length || 0,
        aiLogCount: 0,
    };

    // Fetch log count defensively
    if (user) {
        try {
            const { count, error: countError } = await supabase
                .from("ai_logs")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id);

            if (countError) console.error("Dashboard: Log count error:", countError);
            stats.aiLogCount = count || 0;
        } catch (e) {
            console.error("Dashboard: Log count query failed:", e);
        }
    }

    return (
        <main className="min-h-screen bg-[#020617] text-foreground p-6 md:p-12 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-light tracking-widest uppercase">
                            <Layers className="w-4 h-4" />
                            Command Center
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
                            Intelligence Dashboard
                        </h1>
                        <p className="text-slate-400 font-light">
                            Synthesizing your AI architecture for maximum throughput.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="icon" className="group rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white backdrop-blur-md transition-all" asChild>
                            <Link href="/settings">
                                <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
                            </Link>
                        </Button>
                        <LogoutButton />
                        <Button variant="default" className="rounded-2xl px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20" asChild>
                            <Link href="/focus">
                                <Bot className="w-4 h-4 mr-2" /> Focus Room
                            </Link>
                        </Button>
                        <Button variant="default" className="rounded-2xl px-6 bg-white text-black hover:bg-slate-200" asChild>
                            <Link href="/tools/new">
                                <Plus className="w-4 h-4 mr-2" /> Add Tool
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsOverview stats={[
                        { label: "AI Infrastructure", value: stats.totalTools, icon: "layers", color: "text-blue-400" },
                        { label: "Active Pipelines", value: stats.activeWorkflows, icon: "zap", color: "text-purple-400" },
                        { label: "Strategic Insights", value: stats.aiLogCount, icon: "bot", color: "text-emerald-400" },
                    ]} />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Activity Feed & Management */}
                    <div className="xl:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-light text-white flex items-center gap-3">
                                    <Layout className="w-6 h-6 text-blue-500/50" />
                                    Infrastructure Registry
                                </h2>
                                <Link href="/tools" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Audit All</Link>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                                <ToolList initialTools={tools?.slice(0, 4) || []} />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-light text-white flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-purple-500/50" />
                                    Active Automations
                                </h2>
                                <Link href="/workflows" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Orchestrate</Link>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
                                <WorkflowList initialWorkflows={workflows?.slice(0, 4) || []} />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Intelligence */}
                    <div className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <Bot className="w-6 h-6 text-emerald-500/50" />
                                <h2 className="text-2xl font-light text-white">Strategy Coach</h2>
                            </div>
                            <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                                <AIChatCoach context={{
                                    tools: tools || [],
                                    workflows: workflows || [],
                                    userProfile: user
                                }} />
                            </div>
                        </section>

                        {/* Focus Insight Card */}
                        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-[2rem] p-8 space-y-4 backdrop-blur-xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-medium text-white">Focus Momentum</h3>
                                <p className="text-slate-400 text-sm font-light">
                                    You have sustained 4.2 hours of deep work this week. Ready for another session?
                                </p>
                                <Button className="w-full mt-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all" asChild>
                                    <Link href="/focus">Launch Accelerator</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
