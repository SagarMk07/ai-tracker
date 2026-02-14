"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { signOutAction } from "@/app/actions/ai-tracker";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSignOut = () => {
        startTransition(async () => {
            await signOutAction();
            router.push("/login");
            router.refresh();
        });
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full text-slate-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
            onClick={handleSignOut}
            disabled={isPending}
        >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
        </Button>
    );
}
