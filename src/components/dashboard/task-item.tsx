"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/types";

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, currentStatus: Task["status"]) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all",
                "bg-surface/40 hover:bg-surface/60 hover:border-white/5",
                task.status === "done" && "opacity-50 grayscale"
            )}
        >
            {/* Drag Handle (Visual only for now) */}
            <div className={cn("text-slate-600 cursor-grab opacity-0 transition-opacity", isHovered && "opacity-100")}>
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Checkbox */}
            <button
                onClick={() => onToggle(task.id, task.status)}
                className={cn(
                    "w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center transition-all",
                    task.status === "done"
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "hover:border-indigo-500"
                )}
            >
                {task.status === "done" && <Check className="w-3 h-3" />}
            </button>

            {/* Content */}
            <span className={cn(
                "flex-1 text-sm text-slate-200 font-medium truncate",
                task.status === "done" && "line-through text-slate-500"
            )}>
                {task.title}
            </span>

            {/* Actions */}
            <button className={cn("text-slate-500 hover:text-white opacity-0 transition-opacity", isHovered && "opacity-100")}>
                <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Priority Indicator */}
            <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                task.priority === "high" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                    task.priority === "medium" ? "bg-amber-500" : "bg-slate-600"
            )} />
        </motion.div>
    );
}
