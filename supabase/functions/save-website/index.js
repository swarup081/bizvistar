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

  const { websiteId, websiteData } = await req.json()

  // This is how you would authenticate the user
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

  const { data, error } = await supabase
    .from('websites')
    .update({ draft_data: websiteData, updated_at: new Date() })
    .eq('id', websiteId)
    .eq('user_id', user.id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS LINE
      status: 500,
    })
  }

  return new Response(JSON.stringify({ message: 'Website saved successfully' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }, // <-- EDIT THIS LINE
  })
})