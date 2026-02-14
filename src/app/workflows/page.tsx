import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Plus, ArrowLeft } from "lucide-react";
import { createServerClientComponent } from "@/lib/supabase/server";
import { WorkflowList } from "@/components/workflows/workflow-list";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
    const supabase = await createServerClientComponent();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: workflows } = await supabase.from("workflows")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
                            <Zap className="w-8 h-8 text-purple-400" />
                            Workflows
                        </h1>
                        <p className="text-slate-400 mt-1">Automate your AI interactions with powerful triggers and actions.</p>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <div className="text-sm text-slate-400">
                        You have <span className="text-white font-medium">{workflows?.length || 0}</span> active workflows.
                    </div>
                    <Button variant="default" className="rounded-full bg-purple-600 hover:bg-purple-700" asChild>
                        <Link href="/workflows/new">
                            <Plus className="w-4 h-4 mr-2" /> Create Workflow
                        </Link>
                    </Button>
                </div>

                <section>
                    <WorkflowList initialWorkflows={workflows || []} />
                </section>
            </div>
        </main>
    );
}
