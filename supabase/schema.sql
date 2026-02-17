-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  personality_mode text default 'tactical' check (personality_mode in ('soft', 'tactical', 'ruthless')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- FOCUS SESSIONS
create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  goal text not null,
  intention text,
  duration_minutes integer not null,
  started_at timestamptz default timezone('utc'::text, now()) not null,
  ended_at timestamptz,
  status text default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  risk_factors text[],
  actual_duration_seconds integer,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.focus_sessions enable row level security;
create policy "Users can view own sessions" on public.focus_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.focus_sessions for update using (auth.uid() = user_id);

-- TASKS
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  title text not null,
  description text,
  difficulty_score integer check (difficulty_score >= 1 and difficulty_score <= 10),
  estimated_minutes integer,
  due_date timestamptz,
  is_completed boolean default false,
  ai_suggested_blocks jsonb, -- Array of sub-blocks suggested by AI
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- SESSION REFLECTIONS
create table public.session_reflections (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.focus_sessions not null unique,
  user_id uuid references public.users not null,
  user_rating integer check (user_rating >= 1 and user_rating <= 5),
  user_feedback text,
  ai_feedback text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.session_reflections enable row level security;
create policy "Users can view own reflections" on public.session_reflections for select using (auth.uid() = user_id);
create policy "Users can insert own reflections" on public.session_reflections for insert with check (auth.uid() = user_id);

-- DISTRACTION LOGS
create table public.distraction_logs (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.focus_sessions not null,
  user_id uuid references public.users not null,
  distraction_type text,
  notes text,
  occurred_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.distraction_logs enable row level security;
create policy "Users can view own distractions" on public.distraction_logs for select using (auth.uid() = user_id);
create policy "Users can insert own distractions" on public.distraction_logs for insert with check (auth.uid() = user_id);

-- USER PERFORMANCE METRICS (Daily/Weekly Aggregates)
create table public.performance_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  period_start date not null,
  period_end date not null,
  total_focus_minutes integer default 0,
  sessions_completed integer default 0,
  sessions_abandoned integer default 0,
  streak_days integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.performance_metrics enable row level security;
create policy "Users can view own metrics" on public.performance_metrics for select using (auth.uid() = user_id);

-- TRIGGERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
