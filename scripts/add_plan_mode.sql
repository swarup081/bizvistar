-- SQL to add mode column to public.plans table

ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS mode text CHECK (mode IN ('live', 'test'));

COMMENT ON COLUMN public.plans.mode IS 'Indicates whether the plan is a Live or Test plan.';
