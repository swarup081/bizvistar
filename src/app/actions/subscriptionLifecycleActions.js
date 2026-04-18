'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import { getKeyId, getRazorpayMode } from '../config/razorpay-config';

// Lazy Initialize Supabase Admin
const getSupabaseAdmin = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
};

// Helper to get authenticated user
async function getUser() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch { /* pass */ }
          },
        },
      }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (e) {
    return null;
  }
}

// Get Razorpay instance for current mode
function getRazorpayInstance() {
  const mode = getRazorpayMode();
  let keyId, keySecret;

  if (mode === 'live') {
    keyId = process.env.RAZORPAY_Live_Key_ID || process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID;
    keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;
  } else {
    keyId = getKeyId();
    keySecret = process.env.RAZORPAY_TEST_KEY_SECRET;
  }

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ============================================================
// GET SUBSCRIPTION DETAILS
// Fetches full subscription details from DB + Razorpay API
// Includes reconciliation: if DB and Razorpay are out of sync, fix it
// ============================================================
export async function getSubscriptionDetailsAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch latest subscription from DB (any status)
    const { data: dbSub, error } = await supabaseAdmin
      .from('subscriptions')
      .select(`
        id,
        status, 
        razorpay_subscription_id,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        paused_at,
        metadata,
        plan:plans ( id, name, price, razorpay_plan_id )
      `)
      .eq('user_id', user.id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[SubscriptionDetails] DB error:', error);
      return { success: false, error: 'Failed to fetch subscription data' };
    }

    if (!dbSub) {
      return { success: true, subscription: null };
    }

    // --- RECONCILIATION ---
    // If we have a razorpay_subscription_id, fetch from Razorpay and compare
    let razorpayData = null;
    let reconciled = false;

    if (dbSub.razorpay_subscription_id) {
      try {
        const rzp = getRazorpayInstance();
        razorpayData = await rzp.subscriptions.fetch(dbSub.razorpay_subscription_id);

        // Compare and reconcile
        const rzpStatus = razorpayData.status; // active, paused, cancelled, halted, completed, etc.
        let expectedDbStatus = mapRazorpayStatusToDb(rzpStatus);
        
        if (dbSub.status !== expectedDbStatus) {
          console.log(`[Reconciliation] DB status '${dbSub.status}' != Razorpay status '${rzpStatus}' (expected DB: '${expectedDbStatus}')`);
          
          // Fix the DB
          const updatePayload = {
            status: expectedDbStatus,
            current_period_start: razorpayData.current_start 
              ? new Date(razorpayData.current_start * 1000).toISOString() 
              : dbSub.current_period_start,
            current_period_end: razorpayData.current_end 
              ? new Date(razorpayData.current_end * 1000).toISOString() 
              : dbSub.current_period_end,
            metadata: {
              ...dbSub.metadata,
              last_reconciled: new Date().toISOString(),
              reconciled_from: dbSub.status,
              reconciled_to: expectedDbStatus
            }
          };

          if (rzpStatus === 'paused') {
            updatePayload.paused_at = updatePayload.paused_at || new Date().toISOString();
          }
          if (rzpStatus === 'active') {
            updatePayload.paused_at = null;
          }

          await supabaseAdmin
            .from('subscriptions')
            .update(updatePayload)
            .eq('id', dbSub.id);

          // Also fix website publish state
          if (['active', 'authenticated'].includes(rzpStatus)) {
            await supabaseAdmin
              .from('websites')
              .update({ is_published: true })
              .eq('user_id', user.id);
          } else if (['cancelled', 'paused', 'halted'].includes(rzpStatus)) {
            await supabaseAdmin
              .from('websites')
              .update({ is_published: false })
              .eq('user_id', user.id);
          }

          dbSub.status = expectedDbStatus;
          reconciled = true;
          console.log(`[Reconciliation] Fixed: DB now shows '${expectedDbStatus}'`);
        }
      } catch (rzpErr) {
        console.error('[Reconciliation] Razorpay API check failed:', rzpErr.message);
        // Don't fail the whole request — return DB data plus warning
      }
    }

    return {
      success: true,
      subscription: {
        id: dbSub.id,
        status: dbSub.status,
        razorpaySubscriptionId: dbSub.razorpay_subscription_id,
        currentPeriodStart: dbSub.current_period_start,
        currentPeriodEnd: dbSub.current_period_end,
        cancelAtPeriodEnd: dbSub.cancel_at_period_end,
        pausedAt: dbSub.paused_at,
        plan: dbSub.plan ? {
          id: dbSub.plan.id,
          name: dbSub.plan.name,
          price: dbSub.plan.price,
        } : null,
        metadata: dbSub.metadata
      },
      reconciled,
      razorpayStatus: razorpayData?.status || null
    };

  } catch (err) {
    console.error('[SubscriptionDetails] Error:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================
// CANCEL SUBSCRIPTION (at end of billing period)
// ============================================================
export async function cancelSubscriptionAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = getSupabaseAdmin();

    // Get active subscription
    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, razorpay_subscription_id, status, current_period_end')
      .eq('user_id', user.id)
      .in('status', ['active'])
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !sub) {
      return { success: false, error: 'No active subscription found to cancel.' };
    }

    if (!sub.razorpay_subscription_id) {
      return { success: false, error: 'Subscription has no linked Razorpay ID.' };
    }

    // Call Razorpay API to cancel at end of period
    const rzp = getRazorpayInstance();
    await rzp.subscriptions.cancel(sub.razorpay_subscription_id, { cancel_at_cycle_end: 1 });

    // Update DB: Mark cancel_at_period_end but keep status 'active'
    // The actual status change to 'canceled' happens via webhook when period ends
    await supabaseAdmin
      .from('subscriptions')
      .update({ 
        cancel_at_period_end: true,
        metadata: {
          cancel_requested_at: new Date().toISOString(),
          cancel_type: 'end_of_period'
        }
      })
      .eq('id', sub.id);

    console.log(`[CancelSub] User ${user.id} scheduled cancellation at period end`);

    return { 
      success: true, 
      message: `Your subscription will remain active until ${new Date(sub.current_period_end).toLocaleDateString()}. After that, your website will be taken offline but all your data will be preserved.`
    };

  } catch (err) {
    console.error('[CancelSub] Error:', err);
    return { success: false, error: err.message || 'Failed to cancel subscription.' };
  }
}

// ============================================================
// PAUSE SUBSCRIPTION
// ============================================================
export async function pauseSubscriptionAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = getSupabaseAdmin();

    // Get active subscription
    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, razorpay_subscription_id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !sub) {
      return { success: false, error: 'No active subscription found to pause.' };
    }

    if (!sub.razorpay_subscription_id) {
      return { success: false, error: 'Subscription has no linked Razorpay ID.' };
    }

    // Call Razorpay API to pause
    const rzp = getRazorpayInstance();
    await rzp.subscriptions.pause(sub.razorpay_subscription_id, { pause_initiated_by: 'customer' });

    // Update DB immediately
    await supabaseAdmin
      .from('subscriptions')
      .update({ 
        status: 'paused',
        paused_at: new Date().toISOString(),
        metadata: {
          pause_requested_at: new Date().toISOString()
        }
      })
      .eq('id', sub.id);

    // Unpublish website (preserve data)
    await supabaseAdmin
      .from('websites')
      .update({ is_published: false })
      .eq('user_id', user.id);

    console.log(`[PauseSub] User ${user.id} paused subscription, website unpublished`);

    return { 
      success: true, 
      message: 'Your subscription has been paused. Your website is now offline but all your data (products, orders, settings) is safely preserved. You can resume anytime to bring it back online.'
    };

  } catch (err) {
    console.error('[PauseSub] Error:', err);
    // Check for specific Razorpay errors
    if (err.statusCode === 400) {
      return { success: false, error: 'This subscription cannot be paused. It may already be paused or in a state that does not support pausing.' };
    }
    return { success: false, error: err.message || 'Failed to pause subscription.' };
  }
}

// ============================================================
// RESUME SUBSCRIPTION
// ============================================================
export async function resumeSubscriptionAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabaseAdmin = getSupabaseAdmin();

    // Get paused subscription
    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, razorpay_subscription_id, status')
      .eq('user_id', user.id)
      .eq('status', 'paused')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError || !sub) {
      return { success: false, error: 'No paused subscription found to resume.' };
    }

    if (!sub.razorpay_subscription_id) {
      return { success: false, error: 'Subscription has no linked Razorpay ID.' };
    }

    // Call Razorpay API to resume
    const rzp = getRazorpayInstance();
    await rzp.subscriptions.resume(sub.razorpay_subscription_id, { resume_initiated_by: 'customer' });

    // Update DB immediately
    await supabaseAdmin
      .from('subscriptions')
      .update({ 
        status: 'active',
        paused_at: null,
        cancel_at_period_end: false,
        metadata: {
          resumed_at: new Date().toISOString()
        }
      })
      .eq('id', sub.id);

    // Re-publish website (restore with existing data)
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('id, website_data, draft_data')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (website) {
      const updates = { is_published: true };
      // If website_data was somehow cleared, restore from draft
      if (!website.website_data || (typeof website.website_data === 'object' && Object.keys(website.website_data).length === 0)) {
        if (website.draft_data) {
          updates.website_data = website.draft_data;
        }
      }
      await supabaseAdmin
        .from('websites')
        .update(updates)
        .eq('id', website.id);
      console.log(`[ResumeSub] Website re-published for user ${user.id}`);
    }

    console.log(`[ResumeSub] User ${user.id} resumed subscription`);

    return { 
      success: true, 
      message: 'Your subscription has been resumed! Your website is back online with all your products, orders, and settings intact.'
    };

  } catch (err) {
    console.error('[ResumeSub] Error:', err);
    if (err.statusCode === 400) {
      return { success: false, error: 'This subscription cannot be resumed. Please contact support.' };
    }
    return { success: false, error: err.message || 'Failed to resume subscription.' };
  }
}

// ============================================================
// RECONCILE SUBSCRIPTION
// Called when user suspects DB-Razorpay mismatch (e.g. paid but no access)
// ============================================================
export async function reconcileSubscriptionAction() {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Trigger the details action with reconciliation built-in
    const result = await getSubscriptionDetailsAction();
    
    if (result.success && result.reconciled) {
      return { 
        success: true, 
        message: 'We detected and fixed a sync issue with your subscription. Your access has been updated.',
        reconciled: true
      };
    }

    if (result.success && !result.reconciled && result.subscription) {
      return {
        success: true,
        message: 'Your subscription is in sync. No issues detected.',
        reconciled: false
      };
    }

    return result;

  } catch (err) {
    console.error('[Reconcile] Error:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================
// HELPER: Map Razorpay status to DB status
// ============================================================
function mapRazorpayStatusToDb(razorpayStatus) {
  switch (razorpayStatus) {
    case 'active':
    case 'authenticated':
    case 'completed':
      return 'active';
    case 'paused':
      return 'paused';
    case 'cancelled':
      return 'canceled';
    case 'halted':
    case 'pending':
      return 'past_due';
    default:
      return 'active';
  }
}
