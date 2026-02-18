"use client";

import { useTasks } from "@/hooks/use-tasks";
import { Check, Trash2, Clock, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function TaskList() {
    const { tasks, updateTask, deleteTask, isLoading } = useTasks();

    if (isLoading) {
        return <div className="py-4 text-center text-[var(--text-muted)]">Loading tasks...</div>;
    }

    if (tasks.length === 0) {
        return (
            <div className="py-8 text-center border border-dashed border-[var(--border-soft)] rounded-xl">
                <p className="text-[var(--text-muted)]">No active tasks. Add one above.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <AnimatePresence initial={false}>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={cn(
                            "group flex items-start justify-between gap-3 rounded-xl border p-3 transition-colors",
                            task.status === "done"
                                ? "border-transparent bg-[var(--bg-secondary)]/30 opacity-60"
                                : "border-[var(--border-soft)] bg-[var(--bg-secondary)]/60 hover:border-[var(--border-hover)]"
                        )}
                    >
                        <button
                            onClick={() => updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}
                            className={cn(
                                "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                task.status === "done"
                                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                    : "border-[var(--text-muted)] hover:border-[var(--text-primary)]"
                            )}
                        >
                            {task.status === "done" && <Check size={12} />}
                        </button>

                        <div className="flex-1 space-y-1">
                            <p
                                className={cn(
                                    "font-medium leading-tight transition-all",
                                    task.status === "done" ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"
                                )}
                            >
                                {task.title}
                            </p>

                            {(task.estimated_minutes || task.difficulty_score) && (
                                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                    {task.estimated_minutes && (
                                        <span className="flex items-center gap-1"><Clock size={10} /> {task.estimated_minutes}m</span>
                                    )}
                                    {task.difficulty_score && (
                                        <span className="flex items-center gap-1"><BarChart size={10} /> Lvl {task.difficulty_score}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-[var(--text-muted)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
