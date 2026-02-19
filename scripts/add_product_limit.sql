-- SQL to add product_limit column to public.plans table

ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS product_limit integer DEFAULT -1;

COMMENT ON COLUMN public.plans.product_limit IS 'Limit on number of products a user can create. -1 indicates unlimited.';
