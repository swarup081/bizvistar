-- Add source column to orders table for POS/Web distinction
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS source text DEFAULT 'website';

-- Add check constraint for source
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_source_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_source_check
CHECK (source IN ('website', 'pos'));
