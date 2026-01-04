-- Add stock column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0;

-- Ensure RLS is enabled (good practice, though likely already on)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- If policy doesn't exist, create it (assuming standard authenticated user policy)
-- DO NOT RUN IF EXISTS logic is complex in pure SQL without PL/PGSQL,
-- but we can assume the user has context.
-- For this task, the schema update is the priority.
