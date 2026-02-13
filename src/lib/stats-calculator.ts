import { FocusSession } from "@/types";

export interface UserStats {
    totalFocusMinutes: number;
    sessionsCompleted: number;
    streakDays: number;
}

export function calculateStats(sessions: FocusSession[]): UserStats {
    if (!sessions || sessions.length === 0) {
        return {
            totalFocusMinutes: 0,
            sessionsCompleted: 0,
            streakDays: 0
        };
    }

    const completedSessions = sessions.filter(s => s.completed);

    // Minutes
    const totalSeconds = completedSessions.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
    const totalFocusMinutes = Math.floor(totalSeconds / 60);

    // Streak (Count unique active days for MVP)
    const uniqueDays = new Set(completedSessions.map((s) => new Date(s.started_at).toDateString()));
    const streakDays = uniqueDays.size;

    return {
        totalFocusMinutes,
        sessionsCompleted: completedSessions.length,
        streakDays
    };
}
