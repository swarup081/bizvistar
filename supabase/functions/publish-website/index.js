import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { websiteId, draftId } = await req.json()

    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // --- 1. SUBSCRIPTION CHECK ---
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Prioritize latest
        .limit(1)
        .maybeSingle();

    let isSubscribed = false;
    if (subscription) {
        const { status, current_period_end } = subscription;
        const now = new Date();
        const periodEnd = new Date(current_period_end);

        // Active/Trialing/Completed (mapped to active) are valid.
        // Check date.
        if (['active', 'trialing'].includes(status) && now <= periodEnd) {
            isSubscribed = true;
        }
    }

    if (!isSubscribed) {
         return new Response(JSON.stringify({ error: 'Active subscription required to publish.', needsPayment: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403,
         });
    }

    // --- 2. FETCH DATA TO PUBLISH ---
    let dataToPublish = null;
    let sourceBusinessName = null;
    let sourceTemplateId = null;

    if (draftId) {
        const { data: draft, error: draftError } = await supabase
            .from('website_drafts')
            .select('*')
            .eq('id', draftId)
            .eq('user_id', user.id)
            .single();

        if (draftError || !draft) {
             return new Response(JSON.stringify({ error: 'Draft not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
             });
        }
        dataToPublish = draft.draft_data;
        sourceBusinessName = draft.business_name;
        sourceTemplateId = draft.template_id;
    } else if (websiteId) {
        const { data: site, error: siteError } = await supabase
            .from('websites')
            .select('*')
            .eq('id', websiteId)
            .eq('user_id', user.id)
            .single();

        if (siteError || !site) {
             return new Response(JSON.stringify({ error: 'Website not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
             });
        }
        dataToPublish = site.draft_data;
        // We don't change business name or template if publishing self, unless we want to pull from draft_data?
        // Assuming draft_data structure matches website_data.
    } else {
        return new Response(JSON.stringify({ error: 'Missing draftId or websiteId' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
         });
    }

    if (!dataToPublish) {
        return new Response(JSON.stringify({ error: 'No content to publish.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
         });
    }

    // --- 3. PUBLISH TO WEBSITES TABLE ---
    // User is limited to 1 live website.
    const { data: existingSite } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

    let publishedSiteId;

    if (existingSite) {
        // Update existing live site
        // Scenario D & E: Whether self-publish or overwrite from draft, we update both columns
        const updates = {
            website_data: dataToPublish,
            is_published: true,
            updated_at: new Date(),
            draft_data: dataToPublish // Sync draft to match live
        };
        if (sourceBusinessName) updates.business_name = sourceBusinessName;
        if (sourceTemplateId) updates.template_id = sourceTemplateId;

        const { error: updateError } = await supabase
            .from('websites')
            .update(updates)
            .eq('id', existingSite.id);

        if (updateError) {
             throw updateError;
        }
        publishedSiteId = existingSite.id;
    } else {
        // Create new live site
        // Generate a slug if we don't have one (should be handled by onboarding, but fallback here)
        const cleanName = (sourceBusinessName || 'site').toLowerCase().replace(/[^a-z0-9]/g, '');
        const slug = `${cleanName}-${Date.now().toString().slice(-6)}`;

        const { data: newSite, error: insertError } = await supabase
            .from('websites')
            .insert({
                user_id: user.id,
                template_id: sourceTemplateId || 1, // Fallback
                site_slug: slug,
                is_published: true,
                website_data: dataToPublish,
                draft_data: dataToPublish,
                business_name: sourceBusinessName
            })
            .select('id')
            .single();

        if (insertError) {
            throw insertError;
        }
        publishedSiteId = newSite.id;
    }

    // Trigger Deploy Hook
    const vercelDeployHook = Deno.env.get('VERCEL_DEPLOY_HOOK');
    if (vercelDeployHook) {
        await fetch(vercelDeployHook, { method: 'POST' });
    }

    return new Response(JSON.stringify({ message: 'Website published successfully.', websiteId: publishedSiteId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error("Publish Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
