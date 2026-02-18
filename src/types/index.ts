export type PersonalityMode = "soft" | "tactical" | "ruthless";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  personality_mode: PersonalityMode;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  goal: string;
  duration_minutes: number;
  risk_factors: string[];
  intention: string | null;
  status: "in_progress" | "completed" | "abandoned";
  started_at: string | null;
  ended_at: string | null;
  recovered: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionReflection {
  id: string;
  session_id: string;
  user_id: string;
  summary: string;
  wins: string[];
  blockers: string[];
  next_action: string | null;
  user_rating: number | null;
  user_feedback: string | null;
  created_at: string;
}

export interface DistractionLog {
  id: string;
  user_id: string;
  session_id: string;
  distraction_type: string | null;
  notes: string | null;
  occurred_at: string;
}

export interface TaskItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  estimated_minutes: number | null;
  difficulty_score: number | null;
  suggested_time: string | null;
  ai_breakdown: { title: string; minutes: number; reason: string }[];
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetric {
  id: string;
  user_id: string;
  week_start: string;
  total_focus_minutes: number;
  completed_sessions: number;
  completion_rate: number;
  distraction_count: number;
  streak_days: number;
  trend_score: number;
  weekly_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSnapshot {
  weeklyFocusHours: number;
  streakDays: number;
  completionRate: number;
  distractionCount: number;
  trendScore: number;
}

export interface TaskIntelligence {
  difficultyScore: number;
  suggestedTime: string;
  focusBlocks: Array<{ title: string; minutes: number; reason: string }>;
}
