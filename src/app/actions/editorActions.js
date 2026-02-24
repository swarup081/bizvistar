'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateUserSubscription } from './subscriptionUtils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to get authenticated user ID
async function getUserId() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user.id;
}

// Action: Save Draft
export async function saveDraft(websiteId, draftData) {
  try {
    const userId = await getUserId();

    // Verify ownership
    const { error: verifyError } = await supabaseAdmin
      .from('websites')
      .select('id')
      .eq('id', websiteId)
      .eq('user_id', userId)
      .single();

    if (verifyError) throw new Error('Unauthorized access to website.');

    const { error } = await supabaseAdmin
      .from('websites')
      .update({ draft_data: draftData, updated_at: new Date() })
      .eq('id', websiteId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Save Draft Error:', error);
    return { success: false, error: error.message };
  }
}

// Action: Publish Website
export async function publishWebsite(websiteId, currentData = null) {
  try {
    const userId = await getUserId();

    // 1. Verify ownership
    const { data: website, error: verifyError } = await supabaseAdmin
        .from('websites')
        .select('id, draft_data, website_data')
        .eq('id', websiteId)
        .eq('user_id', userId)
        .single();

    if (verifyError || !website) throw new Error('Unauthorized access or website not found.');

    // 2. Check Subscription
    try {
        await validateUserSubscription(userId);
    } catch (subError) {
        // If subscription is invalid/inactive
        return { success: false, error: 'PAYMENT_REQUIRED', message: subError.message };
    }

    // 3. Publish
    // If currentData is provided (from editor state), use it.
    // Otherwise fallback to stored draft_data, then website_data.
    const dataToPublish = currentData || website.draft_data || website.website_data;

    if (!dataToPublish) {
        return { success: false, error: 'No data to publish.' };
    }

    const { error: updateError } = await supabaseAdmin
        .from('websites')
        .update({
            website_data: dataToPublish,
            is_published: true,
            draft_data: null, // Clear draft after publishing to indicate sync state
            updated_at: new Date()
        })
        .eq('id', websiteId);

    if (updateError) throw updateError;

    return { success: true };

  } catch (error) {
    console.error('Publish Error:', error);
    return { success: false, error: error.message };
  }
}


// Action: Revert to Published (Restart)
export async function revertToPublished(websiteId) {
    try {
        const userId = await getUserId();

        // 1. Verify ownership and get published data
        const { data: website, error: verifyError } = await supabaseAdmin
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .eq('user_id', userId)
            .single();

        if (verifyError || !website) throw new Error('Unauthorized or website not found.');

        // 2. Clear draft_data so next load uses website_data
        const { error: updateError } = await supabaseAdmin
            .from('websites')
            .update({ draft_data: null })
            .eq('id', websiteId);

        if (updateError) throw updateError;

        return { success: true, data: website.website_data };

    } catch (error) {
        console.error('Revert Error:', error);
        return { success: false, error: error.message };
    }
}
