-- =============================================
-- BizVistar — Data Cleanup for Subscription Bugs
-- Run this in Supabase SQL Editor AFTER the migration
-- =============================================

-- ISSUE 1: Multiple active subscriptions per user
-- Keep only the LATEST active subscription (highest id), cancel the rest
-- This fixes the duplicate active subs caused by missing deactivation on upgrade

WITH latest_active AS (
  SELECT DISTINCT ON (user_id) id, user_id
  FROM public.subscriptions
  WHERE status = 'active'
  ORDER BY user_id, id DESC
)
UPDATE public.subscriptions s
SET 
  status = 'canceled',
  metadata = jsonb_build_object(
    'superseded_reason', 'data_cleanup',
    'cleanup_date', now()::text
  )
WHERE s.status = 'active'
  AND s.id NOT IN (SELECT id FROM latest_active);

-- ISSUE 2: current_period_end = epoch 0 (1970-01-01)
-- These were caused by Razorpay returning null for current_start/current_end
-- Fix: set them to now() so validation doesn't immediately block users
-- The next webhook event will update them correctly

UPDATE public.subscriptions
SET 
  current_period_start = COALESCE(created_at, now()),
  current_period_end = COALESCE(created_at, now()) + interval '30 days'
WHERE current_period_end = '1970-01-01T00:00:00+00:00'
   OR current_period_end IS NULL;

-- Verify the cleanup
SELECT id, user_id, status, current_period_start, current_period_end, razorpay_subscription_id
FROM public.subscriptions
ORDER BY id DESC
LIMIT 15;
