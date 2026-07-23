-- =============================================
-- BizVistar Subscription Model Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add 'paused' to the status check constraint
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check 
  CHECK (status = ANY (ARRAY['active'::text, 'canceled'::text, 'past_due'::text, 'paused'::text]));

-- 2. Add created_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN created_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- 3. Add cancel_at_period_end column to track end-of-period cancellations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'cancel_at_period_end'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN cancel_at_period_end boolean DEFAULT false;
  END IF;
END $$;

-- 4. Add paused_at column to track when subscription was paused
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'subscriptions' 
    AND column_name = 'paused_at'
  ) THEN
    ALTER TABLE public.subscriptions ADD COLUMN paused_at timestamp with time zone;
  END IF;
END $$;
