-- Run this in your Supabase SQL Editor to update the tasks table

-- 1. Add status column and description if tasks table exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'completed') THEN
        ALTER TABLE public.tasks ADD COLUMN status text check (status in ('todo', 'in_progress', 'done', 'wishlist')) default 'todo';
        -- Migrate data
        UPDATE public.tasks SET status = 'done' WHERE completed = true;
        
        ALTER TABLE public.tasks DROP COLUMN completed;
        ALTER TABLE public.tasks DROP COLUMN deep_work;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'description') THEN
        ALTER TABLE public.tasks ADD COLUMN description text;
    END IF;
END $$;
