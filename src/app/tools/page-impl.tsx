"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { ToolList } from "@/components/tools/tool-list";
import { Tool } from "@/types";
import { createToolAction } from "@/app/actions/ai-tracker";

interface ToolsPageProps {
    initialTools: Tool[];
}

export default function ToolsPage({ initialTools }: ToolsPageProps) {
    const [name, setName] = useState("");
    const [isPending, startTransition] = useTransition();

    async function handleAddTool() {
        if (!name.trim()) return;

        startTransition(async () => {
            try {
                await createToolAction(name);
                setName("");
            } catch (error) {
                console.error("Error adding tool:", error);
                alert("Failed to add tool. Please try again.");
            }
        });
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">Your AI Toolbox</h1>
                        <p className="text-slate-400 mt-1">Manage and track your essential AI tools.</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-800">
                <Input
                    className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-blue-500/50"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Perplexity AI"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTool()}
                />
                <Button
                    className="bg-blue-600 hover:bg-blue-500 rounded-xl px-6"
                    onClick={handleAddTool}
                    disabled={isPending || !name.trim()}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Add Tool
                </Button>
            </div>

            <div className="space-y-4">
                <ToolList initialTools={initialTools} />
            </div>
        </div>
    );
}
