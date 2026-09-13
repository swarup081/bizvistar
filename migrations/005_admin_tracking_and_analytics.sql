-- 1. Create Shared Link Analytics Table
CREATE TABLE IF NOT EXISTS public.shared_link_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id text NOT NULL REFERENCES public.shared_templates(share_id) ON DELETE CASCADE,
  ip_address text,
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'click_signin')),
  created_at timestamptz DEFAULT now()
);

-- 2. Create index for fast analytics grouping
CREATE INDEX IF NOT EXISTS idx_shared_link_analytics_share_id_event ON public.shared_link_analytics(share_id, event_type);

-- 3. RLS Policies
ALTER TABLE public.shared_link_analytics ENABLE ROW LEVEL SECURITY;

-- Analytics can only be inserted, and it's done via service role or explicitly allowed by anon for public claim pages
-- Actually, we'll insert via server actions (Service Role), so no public RLS needed for INSERT if we use supabaseAdmin.
-- But just in case, we block client-side access.
CREATE POLICY "Block public access to shared_link_analytics" ON public.shared_link_analytics
  FOR ALL USING (false);

-- 4. Enable Impersonation Support in Database
-- Supabase RLS functions sometimes check `auth.uid()`. When impersonating, `auth.uid()` still 
-- returns the admin's actual user ID. This is fine because we'll use the Service Role key 
-- to fetch data for the impersonated user on the backend. No DB schema changes required for impersonation.
