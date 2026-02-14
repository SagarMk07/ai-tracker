"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("App Error Boundary:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 text-center">
            <div className="space-y-6 max-w-md">
                <h1 className="text-4xl font-light tracking-tight text-white">Something went wrong</h1>
                <p className="text-slate-400">
                    An unexpected error occurred in the application logic.
                    {error.message && <span className="block mt-2 text-red-400/80 text-sm font-mono">{error.message}</span>}
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => reset()} className="rounded-full bg-blue-600">
                        Try again
                    </Button>
                    <Button variant="outline" className="rounded-full" asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
