"use client";

import { useState } from "react";
import { TaskItem } from "./task-item";
import { TaskInput } from "./task-input";
import { Task } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { PrioritizeButton } from "./prioritize-button";

interface TaskBoardProps {
    initialTasks?: Task[];
}

export function TaskBoard({ initialTasks = [] }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [addingZone, setAddingZone] = useState<"todo" | "wishlist" | null>(null);
    const supabase = createClient();

    const handleToggle = async (id: string, currentStatus: Task["status"]) => {
        // Optimistic update
        const newStatus: Task["status"] = currentStatus === "done" ? "todo" : "done";

        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: newStatus } : t
        ));

        // DB Update
        await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
    };

    const handleAdd = async (title: string, zone: "todo" | "wishlist") => {
        if (!title.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(), // Temp ID
            user_id: "temp", // Placeholder
            title,
            status: zone,
            priority: "medium", // Default
            created_at: new Date().toISOString()
        };

        // Optimistic Add
        setTasks(prev => [newTask, ...prev]);
        setAddingZone(null);

        // DB Insert
        const { data, error } = await supabase.from("tasks").insert({
            title,
            status: zone,
            priority: "medium"
        }).select().single();

        if (data) {
            // Replace optimstic task with real one (mostly for ID)
            setTasks(prev => prev.map(t => t.id === newTask.id ? data as Task : t));
        } else {
            console.error("Failed to add task", error);
            // Revert on error?
        }
    };

    const todayTasks = tasks.filter(t => t.status === "todo" || t.status === "done");
    const wishlistTasks = tasks.filter(t => t.status === "wishlist");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Today Zone */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-semibold text-white tracking-tight">Today</h2>
                        <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-slate-400 font-mono">
                            {todayTasks.filter(t => t.status !== "done").length}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <PrioritizeButton />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAddingZone("todo")}
                            className="h-8 w-8 text-slate-400 hover:text-white"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-surface/30 border border-white/5 rounded-2xl p-4 space-y-2 min-h-[400px]">
                    <AnimatePresence>
                        {addingZone === "todo" && (
                            <TaskInput
                                zone="todo"
                                onAdd={handleAdd}
                                onCancel={() => setAddingZone(null)}
                            />
                        )}
                        {todayTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
                        ))}
                    </AnimatePresence>

                    {todayTasks.length === 0 && addingZone !== "todo" && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm italic">
                            All clear. Time for deep work?
                        </div>
                    )}
                </div>
            </div>

            {/* Wishlist Zone */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-semibold text-white tracking-tight">Wishlist</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAddingZone("wishlist")}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex-1 bg-surface/30 border border-white/5 rounded-2xl p-4 space-y-2 min-h-[400px]">
                    <AnimatePresence>
                        {addingZone === "wishlist" && (
                            <TaskInput
                                zone="wishlist"
                                onAdd={handleAdd}
                                onCancel={() => setAddingZone(null)}
                            />
                        )}
                        {wishlistTasks.map(task => (
                            <TaskItem key={task.id} task={task} onToggle={handleToggle} />
                        ))}
                    </AnimatePresence>

                    {wishlistTasks.length === 0 && addingZone !== "wishlist" && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm">
                            Empty wishlist.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
