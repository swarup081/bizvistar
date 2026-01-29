-- Create table for storing onboarding wizard state and extra business details
CREATE TABLE IF NOT EXISTS public.onboarding_data (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  website_id bigint NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,

  -- Step 1: Business Identity
  owner_name text,
  business_city text,
  whatsapp_number text,
  logo_url text,

  -- Step 3: Social Proof
  social_instagram text,
  social_facebook text,

  -- Step 4: Payments
  upi_id text,

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  -- Constraint to ensure one onboarding record per website
  CONSTRAINT onboarding_data_website_id_key UNIQUE (website_id)
);

-- RLS Policies (assuming standard RLS setup where users own their websites)
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own onboarding data"
  ON public.onboarding_data
  FOR SELECT
  USING (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own onboarding data"
  ON public.onboarding_data
  FOR INSERT
  WITH CHECK (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own onboarding data"
  ON public.onboarding_data
  FOR UPDATE
  USING (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );
