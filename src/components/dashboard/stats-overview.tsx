"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Layers, Zap, Bot, LucideIcon } from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
    layers: Layers,
    zap: Zap,
    bot: Bot,
};

interface StatItem {
    label: string;
    value: string | number;
    icon: string; // Changed from LucideIcon to string
    color: string;
    subtext?: string;
}

interface StatsOverviewProps {
    stats: StatItem[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    subtext={stat.subtext}
                    delay={index * 0.1}
                />
            ))}
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
    subtext,
    delay
}: {
    label: string,
    value: string | number,
    icon: string, // Changed from LucideIcon to string
    color: string,
    subtext?: string,
    delay: number
}) {
    const Icon = IconMap[icon] || Bot;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3 backdrop-blur-sm"
        >
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace("text-", "bg-"))}>
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
                {label}
            </div>
            <div>
                <div className="text-4xl font-light text-white">{value}</div>
                {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
            </div>
        </motion.div>
    );
}
