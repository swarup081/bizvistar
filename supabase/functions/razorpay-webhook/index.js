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

  // Your existing logic
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS
      status: 401,
    })
  }

  // First, update the website to be published
  const { error: updateError } = await supabase
    .from('websites')
    .update({ is_published: true, updated_at: new Date() })
    .eq('id', websiteId)
    .eq('user_id', user.id)

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS
      status: 500,
    })
  }

  // Then, trigger the Vercel deploy hook
  const vercelDeployHook = Deno.env.get('VERCEL_DEPLOY_HOOK');
  if (vercelDeployHook) {
    await fetch(vercelDeployHook, { method: 'POST' });
  }

  return new Response(JSON.stringify({ message: 'Website published and build triggered.' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS
  })
})