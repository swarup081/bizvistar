-- Add is_unlimited column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_unlimited boolean DEFAULT false;

-- Add index for performance if needed (optional for small scale)
-- CREATE INDEX IF NOT EXISTS idx_products_is_unlimited ON public.products(is_unlimited);
