import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 text-center">
            <div className="space-y-6 max-w-md">
                <h1 className="text-6xl font-light tracking-tighter text-blue-500">404</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl font-light text-white">Page Not Found</h2>
                    <p className="text-slate-400">The portal you're looking for doesn't exist or has been moved.</p>
                </div>
                <Button className="rounded-full bg-blue-600 px-8" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}
