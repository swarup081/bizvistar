
-- Migration: Add metadata to subscriptions and update profiles if needed
-- This script is idempotent

-- 1. Add metadata column to subscriptions if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'metadata') THEN
        ALTER TABLE public.subscriptions ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- 2. Ensure profiles table allows saving email in billing_address (JSONB is flexible, so no schema change needed, but good to verify RLS)
-- RLS Policies are assumed to be handled by Supabase Dashboard, but we ensure the code uses Service Role where needed or checks auth.

-- 3. (Optional) Create an index on metadata for faster coupon lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_metadata_coupon ON public.subscriptions ((metadata->>'coupon_used'));
