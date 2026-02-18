create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  personality_mode text not null default 'tactical' check (personality_mode in ('soft', 'tactical', 'ruthless')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.focus_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  goal text not null,
  intention text,
  duration_minutes integer not null check (duration_minutes between 5 and 240),
  risk_factors text[] not null default '{}',
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default timezone('utc'::text, now()),
  ended_at timestamptz,
  actual_duration_seconds integer,
  recovered boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  difficulty_score integer check (difficulty_score between 1 and 10),
  estimated_minutes integer,
  suggested_time text,
  ai_breakdown jsonb,
  due_date timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.session_reflections (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null unique references public.focus_sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  summary text not null,
  wins text[] not null default '{}',
  blockers text[] not null default '{}',
  next_action text,
  user_rating integer check (user_rating between 1 and 5),
  user_feedback text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.distraction_logs (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.focus_sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  distraction_type text,
  notes text,
  occurred_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.performance_metrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  week_start date not null,
  total_focus_minutes integer not null default 0,
  completed_sessions integer not null default 0,
  completion_rate numeric(5,2) not null default 0,
  distraction_count integer not null default 0,
  streak_days integer not null default 0,
  trend_score numeric(5,2) not null default 0,
  weekly_summary text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique(user_id, week_start)
);

create index if not exists idx_focus_sessions_user_created on public.focus_sessions (user_id, created_at desc);
create index if not exists idx_focus_sessions_user_status on public.focus_sessions (user_id, status);
create index if not exists idx_tasks_user_status on public.tasks (user_id, status);
create index if not exists idx_distraction_logs_user_occurred on public.distraction_logs (user_id, occurred_at desc);
create index if not exists idx_performance_metrics_user_week on public.performance_metrics (user_id, week_start desc);

alter table public.users enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.tasks enable row level security;
alter table public.session_reflections enable row level security;
alter table public.distraction_logs enable row level security;
alter table public.performance_metrics enable row level security;

drop policy if exists "Users can view own data" on public.users;
drop policy if exists "Users can update own data" on public.users;
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

drop policy if exists "Users can view own sessions" on public.focus_sessions;
drop policy if exists "Users can insert own sessions" on public.focus_sessions;
drop policy if exists "Users can update own sessions" on public.focus_sessions;
create policy "focus_sessions_select_own" on public.focus_sessions for select using (auth.uid() = user_id);
create policy "focus_sessions_insert_own" on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "focus_sessions_update_own" on public.focus_sessions for update using (auth.uid() = user_id);

drop policy if exists "Users can view own tasks" on public.tasks;
drop policy if exists "Users can insert own tasks" on public.tasks;
drop policy if exists "Users can update own tasks" on public.tasks;
drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own reflections" on public.session_reflections;
drop policy if exists "Users can insert own reflections" on public.session_reflections;
create policy "reflections_select_own" on public.session_reflections for select using (auth.uid() = user_id);
create policy "reflections_insert_own" on public.session_reflections for insert with check (auth.uid() = user_id);
create policy "reflections_update_own" on public.session_reflections for update using (auth.uid() = user_id);

drop policy if exists "Users can view own distractions" on public.distraction_logs;
drop policy if exists "Users can insert own distractions" on public.distraction_logs;
create policy "distractions_select_own" on public.distraction_logs for select using (auth.uid() = user_id);
create policy "distractions_insert_own" on public.distraction_logs for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view own metrics" on public.performance_metrics;
create policy "performance_select_own" on public.performance_metrics for select using (auth.uid() = user_id);
create policy "performance_upsert_own" on public.performance_metrics for insert with check (auth.uid() = user_id);
create policy "performance_update_own" on public.performance_metrics for update using (auth.uid() = user_id);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();

drop trigger if exists focus_sessions_set_updated_at on public.focus_sessions;
create trigger focus_sessions_set_updated_at before update on public.focus_sessions for each row execute function public.set_updated_at();

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

drop trigger if exists reflections_set_updated_at on public.session_reflections;
create trigger reflections_set_updated_at before update on public.session_reflections for each row execute function public.set_updated_at();

drop trigger if exists performance_metrics_set_updated_at on public.performance_metrics;
create trigger performance_metrics_set_updated_at before update on public.performance_metrics for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      avatar_url = excluded.avatar_url,
      updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
