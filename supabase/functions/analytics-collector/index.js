import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a Supabase client with the service role key to bypass RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Allow cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  const { websiteId, eventType, path, orderId } = await req.json();
  const userAgent = req.headers.get('user-agent');
  // In a real application, you might use a service to get location from IP
  const location = { "city": "unknown", "country": "unknown" };

  const { error } = await supabase.from('client_analytics').insert([
    {
      website_id: websiteId,
      event_type: eventType,
      path: path,
      user_agent: userAgent,
      location: location,
      order_id: orderId
    },
  ]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ collected: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
