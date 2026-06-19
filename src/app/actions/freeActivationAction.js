'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { FREE_TIER_PLAN_ID, FREE_TIER_SUB_PREFIX } from '@/app/config/razorpay-config';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Activates the free (Starter) tier for a user.
 * Creates a subscription record in the DB without involving Razorpay.
 * Publishes the user's website immediately.
 * 
 * Security:
 * - Requires authentication
 * - Checks for existing active subscriptions (prevents double-activation)
 * - Idempotent — re-calling for same user returns existing free sub
 */
export async function activateFreeTier() {
  try {
    // 1. Authenticate
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    // 2. Check for existing active subscription
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status, razorpay_subscription_id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSub) {
      // Already has an active sub — if it's already free tier, return success
      if (existingSub.razorpay_subscription_id?.startsWith(FREE_TIER_SUB_PREFIX)) {
        // Idempotent: already on free tier
        const { data: website } = await supabaseAdmin
          .from('websites')
          .select('site_slug, is_published')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return { 
          success: true, 
          siteSlug: website?.site_slug,
          alreadyActive: true 
        };
      }
      // Has a paid subscription — no need for free tier
      return { success: false, error: 'You already have an active subscription.' };
    }

    // 3. Look up the "Starter Free" plan in plans table
    let { data: freePlan } = await supabaseAdmin
      .from('plans')
      .select('id')
      .eq('razorpay_plan_id', FREE_TIER_PLAN_ID)
      .maybeSingle();

    // If plan doesn't exist yet, create it (self-healing)
    if (!freePlan) {
      const { data: newPlan, error: planError } = await supabaseAdmin
        .from('plans')
        .insert({ name: 'Starter Free', price: 0, razorpay_plan_id: FREE_TIER_PLAN_ID })
        .select('id')
        .single();

      if (planError) {
        console.error('[FreeTier] Failed to create Starter Free plan:', planError);
        return { success: false, error: 'System error. Please try again.' };
      }
      freePlan = newPlan;
    }

    // 4. Create free-tier subscription record
    const freeSubId = `${FREE_TIER_SUB_PREFIX}${user.id}`;
    const now = new Date();
    const farFuture = new Date('2099-12-31T23:59:59Z');

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        razorpay_subscription_id: freeSubId,
        status: 'active',
        plan_id: freePlan.id,
        current_period_start: now.toISOString(),
        current_period_end: farFuture.toISOString(),
        cancel_at_period_end: false,
        metadata: {
          plan_type: 'free',
          activated_at: now.toISOString(),
          coupon_used: 'none'
        }
      }, { onConflict: 'razorpay_subscription_id' });

    if (subError) {
      console.error('[FreeTier] Subscription insert error:', subError);
      return { success: false, error: 'Failed to activate free tier. Please try again.' };
    }

    // 5. Cancel any other stale subscriptions for this user (safety net)
    await supabaseAdmin
      .from('subscriptions')
      .update({ 
        status: 'canceled', 
        metadata: { superseded_by: freeSubId, superseded_at: now.toISOString() } 
      })
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .neq('razorpay_subscription_id', freeSubId);

    // 6. Publish user's website
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('id, site_slug, draft_data, website_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (website) {
      const updates = { is_published: true };

      // If website_data is empty, copy from draft
      if (!website.website_data || (typeof website.website_data === 'object' && Object.keys(website.website_data).length === 0)) {
        updates.website_data = website.draft_data;
      }

      await supabaseAdmin
        .from('websites')
        .update(updates)
        .eq('id', website.id);
    }

    return { 
      success: true, 
      siteSlug: website?.site_slug,
      alreadyActive: false 
    };

  } catch (err) {
    console.error('[FreeTier] Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Internal helper: Try to activate free tier for a given userId.
 * Used by editorActions.publishWebsite() when no subscription exists.
 * Returns { success: boolean } — does NOT require cookies (uses admin client).
 */
export async function tryActivateFreeTierForUser(userId) {
  try {
    // Check for ANY prior subscription (active, canceled, paused, etc.)
    const { data: priorSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (priorSub) {
      // User has had a subscription before — don't auto-activate free tier
      // They need to re-subscribe through checkout
      return { success: false };
    }

    // No prior subscription = truly new user → activate free tier
    let { data: freePlan } = await supabaseAdmin
      .from('plans')
      .select('id')
      .eq('razorpay_plan_id', FREE_TIER_PLAN_ID)
      .maybeSingle();

    if (!freePlan) {
      const { data: newPlan, error: planError } = await supabaseAdmin
        .from('plans')
        .insert({ name: 'Starter Free', price: 0, razorpay_plan_id: FREE_TIER_PLAN_ID })
        .select('id')
        .single();

      if (planError) {
        console.error('[FreeTier] Failed to create plan:', planError);
        return { success: false };
      }
      freePlan = newPlan;
    }

    const freeSubId = `${FREE_TIER_SUB_PREFIX}${userId}`;
    const now = new Date();
    const farFuture = new Date('2099-12-31T23:59:59Z');

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        razorpay_subscription_id: freeSubId,
        status: 'active',
        plan_id: freePlan.id,
        current_period_start: now.toISOString(),
        current_period_end: farFuture.toISOString(),
        cancel_at_period_end: false,
        metadata: {
          plan_type: 'free',
          activated_at: now.toISOString(),
          coupon_used: 'none'
        }
      }, { onConflict: 'razorpay_subscription_id' });

    if (subError) {
      console.error('[FreeTier] Sub insert error:', subError);
      return { success: false };
    }

    return { success: true };

  } catch (err) {
    console.error('[FreeTier] tryActivateFreeTierForUser error:', err);
    return { success: false };
  }
}
