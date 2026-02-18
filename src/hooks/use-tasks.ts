"use client";

import useSWR, { mutate } from "swr";
import { createClient } from "@/services/supabaseClient";
import type { TaskItem } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner"; // Assuming sonner is installed, otherwise will revert to basic console/alert or install it

const fetcher = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data as TaskItem[];
};

export function useTasks() {
    const { data: tasks, error, isLoading, mutate: revalidate } = useSWR<TaskItem[]>("tasks", fetcher);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel("tasks-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tasks" },
                () => {
                    revalidate();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [revalidate, supabase]);

    async function addTask(title: string, intelligence?: any) {
        const tempId = crypto.randomUUID();
        const optimisticTask: TaskItem = {
            id: tempId,
            title,
            status: "todo",
            created_at: new Date().toISOString(),
            user_id: "optimistic",
            ai_breakdown: intelligence?.subTasks || [],
            difficulty_score: intelligence?.difficultyScore || null,
            estimated_minutes: intelligence?.estimatedMinutes || null,
            suggested_time: intelligence?.suggestedTime || null,
            description: null,
            due_date: null,
            updated_at: new Date().toISOString(),
        };

        // Optimistic Update
        mutate("tasks", (currentTasks: TaskItem[] = []) => [optimisticTask, ...currentTasks], false);

        try {
            const { data, error } = await supabase.from("tasks").insert({
                title,
                status: "todo",
                ai_breakdown: intelligence?.subTasks,
                difficulty_score: intelligence?.difficultyScore,
                estimated_minutes: intelligence?.estimatedMinutes,
                suggested_time: intelligence?.suggestedTime
            }).select().single();

            if (error) throw error;

            // Replace optimistic task with real one
            mutate("tasks", (currentTasks: TaskItem[] = []) =>
                currentTasks.map(t => t.id === tempId ? (data as TaskItem) : t)
                , false);

        } catch (err) {
            console.error(err);
            toast.error("Failed to add task");
            revalidate(); // Rollback
        }
    }

    async function updateTask(id: string, updates: Partial<TaskItem>) {
        mutate(
            "tasks",
            (currentTasks: TaskItem[] = []) =>
                currentTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
            false
        );

        try {
            const { error } = await supabase.from("tasks").update(updates).eq("id", id);
            if (error) throw error;
        } catch (err) {
            console.error(err);
            toast.error("Failed to update task");
            revalidate();
        }
    }

    async function deleteTask(id: string) {
        mutate(
            "tasks",
            (currentTasks: TaskItem[] = []) => currentTasks.filter((t) => t.id !== id),
            false
        );

        try {
            const { error } = await supabase.from("tasks").delete().eq("id", id);
            if (error) throw error;
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete task");
            revalidate();
        }
    }

    return {
        tasks: tasks || [],
        isLoading,
        isError: error,
        addTask,
        updateTask,
        deleteTask,
    };
}
