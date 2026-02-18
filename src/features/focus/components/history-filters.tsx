"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HistoryFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("filter") || "all";

    function setFilter(filter: string) {
        const params = new URLSearchParams(searchParams);
        if (filter === "all") {
            params.delete("filter");
        } else {
            params.set("filter", filter);
        }
        router.replace(`${pathname}?${params.toString()}`);
    }

    const filters = [
        { id: "all", label: "All Time" },
        { id: "today", label: "Today" },
        { id: "week", label: "This Week" },
        { id: "month", label: "This Month" },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <Button
                    key={filter.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(filter.id)}
                    className={cn(
                        "rounded-full transition-all",
                        currentFilter === filter.id
                            ? "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
                            : "border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    {filter.label}
                </Button>
            ))}
        </div>
    );
}
