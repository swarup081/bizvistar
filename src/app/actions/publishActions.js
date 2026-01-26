'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Admin client for DB updates (bypassing RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

// Helper to get authenticated user
async function getUser() {
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
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function verifyAndPublishUserSite() {
  try {
    const user = await getUser();
    if (!user) {
        console.error("verifyAndPublishUserSite: No user found.");
        return { success: false, error: "Unauthorized" };
    }

    console.log(`[PublishAction] Verifying subscription for user ${user.id}...`);

    // 1. Check for Valid Subscription
    const { data: subscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('current_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (subError) {
        console.error("[PublishAction] Error checking subscription:", subError);
        return { success: false, error: "Database error checking subscription." };
    }

    if (!subscription) {
        console.warn("[PublishAction] No active subscription found.");
        return { success: false, error: "No active subscription found. Please contact support if you have paid." };
    }

    // Double check expiry
    const now = new Date();
    const end = new Date(subscription.current_period_end);
    if (now > end) {
        console.warn("[PublishAction] Subscription expired.");
        return { success: false, error: "Subscription expired." };
    }

    // 2. Publish Website
    const { data: website, error: webError } = await supabaseAdmin
        .from('websites')
        .select('id, draft_data, is_published')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

    if (webError || !website) {
        console.error("[PublishAction] Website not found:", webError);
        return { success: false, error: "Website not found." };
    }

    if (website.is_published) {
        return { success: true, message: "Already published." };
    }

    const updatePayload = { is_published: true };
    if (website.draft_data && Object.keys(website.draft_data).length > 0) {
        updatePayload.website_data = website.draft_data;
    }

    const { error: updateError } = await supabaseAdmin
        .from('websites')
        .update(updatePayload)
        .eq('id', website.id);

    if (updateError) {
        console.error("[PublishAction] Update failed:", updateError);
        return { success: false, error: "Failed to publish website." };
    }

    console.log("[PublishAction] Website published successfully via fallback action.");
    return { success: true };

  } catch (err) {
    console.error("[PublishAction] Unexpected error:", err);
    return { success: false, error: err.message };
  }
}
