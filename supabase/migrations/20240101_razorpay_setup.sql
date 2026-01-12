-- 1. Add email to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- 2. Ensure plans table supports text ID (already does, but verifying)
-- The user provided schema has razorpay_plan_id text UNIQUE. Good.

-- 3. We might want to clear existing plans to avoid confusion if we are re-seeding
-- TRUNCATE public.plans CASCADE;
-- (Commented out to be safe, but useful if re-running from scratch)

-- 4. Create Coupons table for local lookup/display (optional but good for UI)
CREATE TABLE IF NOT EXISTS public.coupons (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text CHECK (discount_type IN ('percent', 'flat')),
  discount_value numeric NOT NULL,
  razorpay_offer_id text, -- ID from Razorpay if applicable
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Insert the Test Coupon
INSERT INTO public.coupons (code, discount_type, discount_value, description)
VALUES ('TEST70', 'percent', 70, '70% Off for testing')
ON CONFLICT (code) DO NOTHING;
