-- =============================================
-- BizVistar Admin Panel & Template Sharing Migration
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Admin users whitelist table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Shared templates table (admin-created shareable template links)
CREATE TABLE IF NOT EXISTS public.shared_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT UNIQUE NOT NULL,        -- short URL-safe ID for the public link
  template_name TEXT NOT NULL,           -- base template (e.g., 'flavornest')
  business_name TEXT,
  tagline TEXT,
  theme TEXT,                            -- CSS theme class name
  customizations JSONB DEFAULT '{}',     -- full draft_data snapshot from editor
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  claimed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Claims tracking table
CREATE TABLE IF NOT EXISTS public.template_claims (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  shared_template_id UUID REFERENCES public.shared_templates(id),
  user_id UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ DEFAULT now(),
  website_id BIGINT                      -- links to the website created from this claim
);

-- 4. RLS policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_claims ENABLE ROW LEVEL SECURITY;

-- Admin users: only service role can read/write (no client access)
CREATE POLICY "Service role only" ON public.admin_users FOR ALL USING (false);

-- Shared templates: public can read active ones, admin can do everything
CREATE POLICY "Public read active shared templates" ON public.shared_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access shared templates" ON public.shared_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Claims: users can read their own claims
CREATE POLICY "User read own claims" ON public.template_claims
  FOR SELECT USING (user_id = auth.uid());

-- 5. Seed initial admin users
-- NOTE: user_id will be NULL until these users actually sign up.
-- The system matches by email, so they'll be recognized as admin upon login.
INSERT INTO public.admin_users (email, role) VALUES
  ('dasswarup1122332211@gmail.com', 'admin'),
  ('dasswarup112233@gmail.com', 'admin'),
  ('dasswarup.work@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 6. Create index for fast share_id lookups
CREATE INDEX IF NOT EXISTS idx_shared_templates_share_id ON public.shared_templates(share_id);
CREATE INDEX IF NOT EXISTS idx_template_claims_user_id ON public.template_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
