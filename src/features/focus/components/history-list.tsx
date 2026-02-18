import { FocusSession } from "@/types";
import { Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface HistoryListProps {
    sessions: FocusSession[];
}

export function HistoryList({ sessions }: HistoryListProps) {
    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl border-dashed border-[var(--border-soft)]">
                <div className="p-4 rounded-full bg-[var(--bg-secondary)] mb-4">
                    <Clock className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-lg font-medium">No sessions found</h3>
                <p className="text-[var(--text-muted)] max-w-sm mt-1">
                    Start a focus session to build your history.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
                <article
                    key={session.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--bg-secondary)]/30 p-5 transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)]/50"
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                                {format(new Date(session.created_at), "MMM d, yyyy")}
                            </span>
                            {session.status === "completed" ? (
                                <div className="flex items-center gap-1 text-xs text-green-400">
                                    <CheckCircle size={12} />
                                    <span>Completed</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-xs text-red-400">
                                    <XCircle size={12} />
                                    <span>Abandoned</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-[var(--text-primary)] line-clamp-2">
                                {session.goal}
                            </h3>
                            {session.intention && (
                                <p className="mt-1 text-sm text-[var(--text-muted)] italic line-clamp-2">
                                    "{session.intention}"
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{session.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{format(new Date(session.created_at), "h:mm a")}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
