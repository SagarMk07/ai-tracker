export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    personality_mode: "soft" | "tactical" | "ruthless" | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    personality_mode?: "soft" | "tactical" | "ruthless" | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    personality_mode?: "soft" | "tactical" | "ruthless" | null
                    created_at?: string
                }
            }
            focus_sessions: {
                Row: {
                    id: string
                    user_id: string
                    goal: string
                    intention: string | null
                    duration_minutes: number
                    started_at: string
                    ended_at: string | null
                    status: "in_progress" | "completed" | "abandoned" | null
                    risk_factors: string[] | null
                    actual_duration_seconds: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    goal: string
                    intention?: string | null
                    duration_minutes: number
                    started_at?: string
                    ended_at?: string | null
                    status?: "in_progress" | "completed" | "abandoned" | null
                    risk_factors?: string[] | null
                    actual_duration_seconds?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    goal?: string
                    intention?: string | null
                    duration_minutes?: number
                    started_at?: string
                    ended_at?: string | null
                    status?: "in_progress" | "completed" | "abandoned" | null
                    risk_factors?: string[] | null
                    actual_duration_seconds?: number | null
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    difficulty_score: number | null
                    estimated_minutes: number | null
                    due_date: string | null
                    is_completed: boolean | null
                    ai_suggested_blocks: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    difficulty_score?: number | null
                    estimated_minutes?: number | null
                    due_date?: string | null
                    is_completed?: boolean | null
                    ai_suggested_blocks?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    difficulty_score?: number | null
                    estimated_minutes?: number | null
                    due_date?: string | null
                    is_completed?: boolean | null
                    ai_suggested_blocks?: Json | null
                    created_at?: string
                }
            }
            session_reflections: {
                Row: {
                    id: string
                    session_id: string
                    user_id: string
                    user_rating: number | null
                    user_feedback: string | null
                    ai_feedback: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    user_id: string
                    user_rating?: number | null
                    user_feedback?: string | null
                    ai_feedback?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    user_id?: string
                    user_rating?: number | null
                    user_feedback?: string | null
                    ai_feedback?: string | null
                    created_at?: string
                }
            }
            distraction_logs: {
                Row: {
                    id: string
                    session_id: string
                    user_id: string
                    distraction_type: string | null
                    notes: string | null
                    occurred_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    user_id: string
                    distraction_type?: string | null
                    notes?: string | null
                    occurred_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    user_id?: string
                    distraction_type?: string | null
                    notes?: string | null
                    occurred_at?: string
                }
            }
            performance_metrics: {
                Row: {
                    id: string
                    user_id: string
                    period_start: string
                    period_end: string
                    total_focus_minutes: number | null
                    sessions_completed: number | null
                    sessions_abandoned: number | null
                    streak_days: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    period_start: string
                    period_end: string
                    total_focus_minutes?: number | null
                    sessions_completed?: number | null
                    sessions_abandoned?: number | null
                    streak_days?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    period_start?: string
                    period_end?: string
                    total_focus_minutes?: number | null
                    sessions_completed?: number | null
                    sessions_abandoned?: number | null
                    streak_days?: number | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
