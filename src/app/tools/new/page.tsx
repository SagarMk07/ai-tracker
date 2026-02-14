"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createToolAction } from "@/app/actions/ai-tracker";

export const dynamic = "force-dynamic";

export default function NewToolPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        url: "",
        category: "",
        pricing_type: "free" as const,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                await createToolAction(
                    formData.name,
                    formData.description,
                    formData.category,
                    formData.url,
                    formData.pricing_type
                );
                router.push("/tools");
            } catch (error: any) {
                console.error("Error adding tool:", error);
                alert(error.message || "Failed to add tool");
            }
        });
    };

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-2xl mx-auto space-y-8">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400" asChild>
                        <Link href="/tools">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">Add New tool</h1>
                        <p className="text-slate-400 mt-1">Found a new AI game changer? Add it here.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Tool Name *</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Claude 3, Midjourney"
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <Input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What does it do?"
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-sm font-medium text-slate-300">Category</label>
                                <Input
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g. LLM, Image Gen"
                                    className="bg-slate-950 border-slate-800 text-white"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-sm font-medium text-slate-300">Pricing</label>
                                <select
                                    value={formData.pricing_type}
                                    onChange={e => setFormData({ ...formData, pricing_type: e.target.value as any })}
                                    className="h-10 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="free">Free</option>
                                    <option value="freemium">Freemium</option>
                                    <option value="paid">Paid</option>
                                    <option value="subscription">Subscription</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-slate-300">Website URL</label>
                            <Input
                                type="url"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://example.ai"
                                className="bg-slate-950 border-slate-800 text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <Button
                            disabled={isPending || !formData.name}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Tool
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/tools">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
