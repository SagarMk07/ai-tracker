export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done" | "wishlist";
    priority: "low" | "medium" | "high";
    due_date?: string;
    created_at: string;
}

export interface FocusSession {
    id: string;
    user_id: string;
    intent: string;
    duration_seconds: number;
    started_at: string;
    ended_at?: string;
    completed: boolean;
    distraction_count?: number;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    focus_integrity_score: number;
}
