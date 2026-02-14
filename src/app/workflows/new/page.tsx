"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save, Zap, Sparkles, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Tool, WorkflowAction } from "@/types";
import { createWorkflowAction } from "@/app/actions/ai-tracker";

export const dynamic = "force-dynamic";

export default function NewWorkflowPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [suggesting, setSuggesting] = useState(false);
    const [tools, setTools] = useState<Tool[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        trigger: "",
        actions: [] as WorkflowAction[],
    });

    const supabase = createClient();

    useEffect(() => {
        const fetchTools = async () => {
            const { data } = await supabase.from("tools").select("*");
            if (data) setTools(data);
        };
        fetchTools();
    }, []);

    const handleAddAction = () => {
        setFormData({
            ...formData,
            actions: [...formData.actions, { type: "action", description: "" }]
        });
    };

    const handleRemoveAction = (index: number) => {
        const newActions = [...formData.actions];
        newActions.splice(index, 1);
        setFormData({ ...formData, actions: newActions });
    };

    const handleActionChange = (index: number, description: string) => {
        const newActions = [...formData.actions];
        newActions[index].description = description;
        setFormData({ ...formData, actions: newActions });
    };

    const getAISuggestions = async () => {
        if (tools.length === 0) {
            alert("Add some tools first to get AI suggestions!");
            return;
        }

        setSuggesting(true);
        try {
            const response = await fetch("/api/ai/suggest-workflows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toolNames: tools.map(t => t.name) })
            });

            const data = await response.json();
            if (data.recommendations && data.recommendations.length > 0) {
                const rec = data.recommendations[0];
                setFormData({
                    name: rec.name,
                    description: rec.description,
                    trigger: rec.trigger,
                    actions: rec.actions || []
                });
            }
        } catch (error) {
            console.error("Error getting suggestions:", error);
        } finally {
            setSuggesting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                await createWorkflowAction(formData);
                router.push("/workflows");
            } catch (error: any) {
                console.error("Error saving workflow:", error);
                alert(error.message || "Failed to save workflow");
            }
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400" asChild>
                            <Link href="/workflows">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-light tracking-tight text-white">Create Workflow</h1>
                            <p className="text-slate-400 mt-1">Define triggers and actions or use AI to generate magic.</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={getAISuggestions}
                        disabled={suggesting}
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {suggesting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        AI Suggest
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Workflow Name</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Content Repurposing Engine"
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <Input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What is the goal of this workflow?"
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Trigger</label>
                            <Input
                                required
                                value={formData.trigger}
                                onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                                placeholder="When this happens... (e.g. New YouTube video uploaded)"
                                className="bg-slate-950 border-slate-800 text-white border-dashed border-indigo-500/50"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                                Actions
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleAddAction}
                                    className="text-indigo-400 hover:text-indigo-300 px-0"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Action
                                </Button>
                            </label>

                            {formData.actions.length === 0 && (
                                <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">
                                    No actions added yet.
                                </div>
                            )}

                            {formData.actions.map((action, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="mt-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={action.description}
                                            onChange={e => handleActionChange(index, e.target.value)}
                                            placeholder="Then do this... (e.g. Extract transcript using Whisper)"
                                            className="bg-slate-950 border-slate-800 text-white"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveAction(index)}
                                        className="text-slate-600 hover:text-rose-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
                        <Button
                            disabled={isPending || !formData.name || !formData.trigger}
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-full"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Create Workflow
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/workflows">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
