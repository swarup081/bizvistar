import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// --- ADD THIS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // --- AND THIS ---
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { websiteId } = await req.json()

  const authHeader = req.headers.get('Authorization')
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS LINE
      status: 401,
    })
  }

  // --- 1. SUBSCRIPTION CHECK ---
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription) {
      return new Response(JSON.stringify({ error: 'No active subscription found. Please upgrade to publish.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
  }

  const { status, current_period_end } = subscription;
  const now = new Date();
  const periodEnd = new Date(current_period_end);

  // Status Check (paused/halted are mapped to past_due in DB)
  if (status === 'canceled' || status === 'past_due') {
       return new Response(JSON.stringify({ error: 'Your subscription is inactive. Cannot publish.' }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 403,
       });
  }
  
  // Date Check (active/trialing/completed->active)
  // If active but expired, block.
  if (now > periodEnd) {
       return new Response(JSON.stringify({ error: 'Your subscription period has ended. Please renew to publish.' }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 403,
       });
  }

  // --- 2. WEBSITE LIMIT CHECK ---
  // Check if user already has a published website (excluding the current one if we are re-publishing)
  const { count } = await supabase
    .from('websites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_published', true)
    .neq('id', websiteId);

  if (count > 0) {
      return new Response(JSON.stringify({ error: 'Limit Reached: You can only have 1 live website. Please unpublish your existing website first.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
  }

  // 1. Fetch current draft data
  const { data: siteData, error: fetchError } = await supabase
      .from('websites')
      .select('draft_data')
      .eq('id', websiteId)
      .eq('user_id', user.id)
      .single();

  if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message || 'Website not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
      });
  }

  // 2. Publish (copy draft -> live)
  const dataToPublish = siteData.draft_data;
  let updatePayload = { is_published: true, updated_at: new Date() };

  if (dataToPublish) {
      updatePayload.website_data = dataToPublish;
  }

  const { error: updateError } = await supabase
    .from('websites')
    .update(updatePayload)
    .eq('id', websiteId)
    .eq('user_id', user.id)

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS LINE
      status: 500,
    })
  }

  // Then, trigger the Vercel deploy hook
  const vercelDeployHook = Deno.env.get('VERCEL_DEPLOY_HOOK');
  if (vercelDeployHook) {
    await fetch(vercelDeployHook, { method: 'POST' });
  }

  return new Response(JSON.stringify({ message: 'Website published and build triggered.' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS LINE
  })
})