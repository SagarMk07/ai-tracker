"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction } from "@/app/actions/ai-tracker";
import { Loader2, Check } from "lucide-react";

export function ProfileForm({ initialData }: { initialData: { full_name: string | null } }) {
    const [fullName, setFullName] = useState(initialData.full_name || "");
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        startTransition(async () => {
            try {
                await updateProfileAction(fullName);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } catch (error) {
                console.error("Failed to update profile", error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-slate-950 border-slate-800 text-white rounded-xl py-6"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending || fullName === initialData.full_name && !saved}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 h-auto"
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : saved ? (
                    <><Check className="w-4 h-4 mr-2" /> Saved!</>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </form>
    );
}
