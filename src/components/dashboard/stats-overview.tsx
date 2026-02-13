"use client";

import { motion } from "framer-motion";
import { Activity, Flame, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
    integrityScore: number;
    totalFocusMinutes: number;
    sessionsCompleted: number;
    streakDays: number;
}

export function StatsOverview({ integrityScore, totalFocusMinutes, sessionsCompleted, streakDays }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                label="Integrity Score"
                value={`${integrityScore}%`}
                icon={Activity}
                color="text-emerald-400"
                subtext="Keep it up"
            />
            <StatCard
                label="Focus Time"
                value={`${Math.round(totalFocusMinutes / 60)}h ${totalFocusMinutes % 60}m`}
                icon={TrendingUp}
                color="text-indigo-400"
                subtext="This week"
            />
            <StatCard
                label="Sessions"
                value={sessionsCompleted.toString()}
                icon={Trophy}
                color="text-amber-400"
                subtext="Completed"
            />
            <StatCard
                label="Streak"
                value={`${streakDays} Days`}
                icon={Flame}
                color="text-rose-400"
                subtext="You're on fire!"
            />
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, subtext }: { label: string, value: string, icon: any, color: string, subtext: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-surface/30 border border-white/5 flex flex-col gap-3 backdrop-blur-sm"
        >
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <Icon className={cn("w-4 h-4", color)} />
                {label}
            </div>
            <div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{subtext}</div>
            </div>
        </motion.div>
    );
}
