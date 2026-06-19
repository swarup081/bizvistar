-- Freemium Migration: Create "Starter Free" plan record
-- This plan is referenced by free-tier subscription records (no Razorpay)
-- Run this in your Supabase SQL Editor

-- 1. Create the Starter Free plan
INSERT INTO plans (name, price, razorpay_plan_id, website_limit, product_limit)
VALUES ('Starter Free', 0, 'free_tier_plan', 1, 25)
ON CONFLICT (razorpay_plan_id) DO NOTHING;

-- 2. Verify the plan was created
SELECT id, name, price, razorpay_plan_id FROM plans WHERE razorpay_plan_id = 'free_tier_plan';

-- NOTE: Existing subscribers are NOT affected by this migration.
-- Their Razorpay subscriptions continue to bill at the original prices.
-- The plan ID reassignment (old Starter → new Pro, old Pro → new Growth) 
-- only affects NEW subscriptions created through the updated checkout flow.
