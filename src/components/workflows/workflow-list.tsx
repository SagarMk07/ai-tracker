"use client";

import { Workflow } from "@/types";
import { Zap, Play, Edit2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import Link from "next/link";
import { deleteWorkflowAction } from "@/app/actions/ai-tracker";

interface WorkflowListProps {
    initialWorkflows: Workflow[];
}

export function WorkflowList({ initialWorkflows }: WorkflowListProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this workflow?")) return;

        startTransition(async () => {
            try {
                await deleteWorkflowAction(id);
            } catch (error) {
                console.error("Error deleting workflow:", error);
            }
        });
    };

    if (initialWorkflows.length === 0) {
        return (
            <div className="bg-white/[0.01] border border-dashed border-white/10 p-12 rounded-[2rem] text-center backdrop-blur-3xl">
                <Zap className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-light">No automation pipelines configured yet.</p>
                <Button variant="link" className="text-purple-400 mt-2 font-light" asChild>
                    <Link href="/workflows/new">Architect your first workflow</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {initialWorkflows.map((workflow) => (
                <div key={workflow.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-purple-500/10 transition-colors" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-light text-lg tracking-tight group-hover:text-purple-400 transition-colors">{workflow.name}</h3>
                            <p className="text-sm text-slate-500 font-light line-clamp-1">{workflow.description || `Tactical Trigger: ${workflow.trigger}`}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5" asChild>
                            <Link href={`/workflows/${workflow.id}/edit`}>
                                <Edit2 className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/5"
                            onClick={() => handleDelete(workflow.id)}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5">
                            <Play className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
