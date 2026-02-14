"use client";

import { Tool } from "@/types";
import { ExternalLink, Trash2, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { deleteToolAction } from "@/app/actions/ai-tracker";

interface ToolListProps {
    initialTools: Tool[];
}

export function ToolList({ initialTools }: ToolListProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this tool?")) return;

        startTransition(async () => {
            try {
                await deleteToolAction(id);
            } catch (error) {
                console.error("Failed to delete tool:", error);
            }
        });
    };

    if (initialTools.length === 0) {
        return (
            <div className="bg-white/[0.01] border border-dashed border-white/10 p-12 rounded-[2rem] text-center backdrop-blur-3xl">
                <Layers className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500 font-light">No tools tracked in your infrastructure yet.</p>
                <Button variant="link" className="text-blue-400 mt-2 font-light" asChild>
                    <a href="/tools/new">Initialize your first AI tool</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialTools.map((tool) => (
                <div key={tool.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-light text-lg tracking-tight group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                            <p className="text-sm text-slate-500 font-light line-clamp-1">{tool.description || "No strategic description"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                        {tool.url && (
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-500 hover:text-white hover:bg-white/5" asChild>
                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/5"
                            onClick={() => handleDelete(tool.id)}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
