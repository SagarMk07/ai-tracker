-- One-time fix for existing projects where auth users exist without public.users rows.
-- Run in Supabase SQL Editor.

-- 0) Ensure RLS is enabled.
alter table public.users enable row level security;

-- 0.1) Ensure required columns exist in legacy environments.
alter table public.users add column if not exists email text;
alter table public.users add column if not exists full_name text;
alter table public.users add column if not exists avatar_url text;
alter table public.users add column if not exists personality_mode text default 'tactical';
update public.users set personality_mode = 'tactical' where personality_mode is null;
alter table public.users alter column personality_mode set default 'tactical';
alter table public.users alter column personality_mode set not null;

-- 0.2) Ensure required focus_sessions columns exist in legacy environments.
alter table public.focus_sessions add column if not exists user_id uuid references public.users(id) on delete cascade;
alter table public.focus_sessions add column if not exists goal text;
alter table public.focus_sessions add column if not exists intention text;
alter table public.focus_sessions add column if not exists duration_minutes integer;
alter table public.focus_sessions add column if not exists risk_factors text[] default '{}';
alter table public.focus_sessions add column if not exists status text default 'in_progress';
alter table public.focus_sessions add column if not exists started_at timestamptz default timezone('utc'::text, now());
alter table public.focus_sessions add column if not exists ended_at timestamptz;
alter table public.focus_sessions add column if not exists actual_duration_seconds integer;
alter table public.focus_sessions add column if not exists recovered boolean default false;
alter table public.focus_sessions add column if not exists created_at timestamptz default timezone('utc'::text, now());
alter table public.focus_sessions add column if not exists updated_at timestamptz default timezone('utc'::text, now());

update public.focus_sessions
set duration_minutes = 25
where duration_minutes is null;

alter table public.focus_sessions
  alter column duration_minutes set default 25;

-- 0.3) Ensure focus_sessions RLS and policies.
alter table public.focus_sessions enable row level security;

do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'focus_sessions'
  loop
    execute format('drop policy if exists %I on public.focus_sessions', p.policyname);
  end loop;
end $$;

create policy "Users can view own sessions"
on public.focus_sessions
for select
using (auth.uid() = user_id);

create policy "Users can insert own sessions"
on public.focus_sessions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own sessions"
on public.focus_sessions
for update
using (auth.uid() = user_id);

-- 1) Reset ALL existing policies on public.users to avoid hidden conflicts.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'users'
  loop
    execute format('drop policy if exists %I on public.users', p.policyname);
  end loop;
end $$;

create policy "Users can insert their own profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Users can view their own profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users
for update
using (auth.uid() = id);

-- 2) Backfill profile rows for existing auth users.
insert into public.users (id, email, full_name, avatar_url)
select
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'avatar_url'
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;

-- 3) Force PostgREST schema cache refresh so new columns are visible immediately.
notify pgrst, 'reload schema';
