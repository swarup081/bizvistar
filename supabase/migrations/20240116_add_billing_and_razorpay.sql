-- Add billing_address column to profiles if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_address jsonb;

-- Ensure RLS allows users to update their own profile
-- (Assuming standard RLS setup where users can update own rows)
-- If not, we might need a policy like:
-- CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Add Razorpay columns to subscriptions if missing (based on provided schema context)
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS razorpay_subscription_id text UNIQUE,
ADD COLUMN IF NOT EXISTS current_period_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS current_period_end timestamp with time zone;

-- Ensure plans has razorpay_plan_id
ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS razorpay_plan_id text UNIQUE;
