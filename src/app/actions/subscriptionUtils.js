'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Validates a user's subscription status and returns their plan details.
 * Implements strict security checks, Founder Plan expiry logic, 
 * grace period for webhook delays, and paused status handling.
 */
export async function validateUserSubscription(userId) {
  if (!userId) throw new Error("User ID required for subscription check.");

  // Fetch the LATEST subscription (any status) to give proper error messages
  // Using 'id' (auto-incrementing IDENTITY) for ordering since it's guaranteed to exist
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      status, 
      current_period_end, 
      cancel_at_period_end,
      paused_at,
      plan:plans ( razorpay_plan_id, name )
    `)
    .eq('user_id', userId)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle(); 

  if (error) {
      console.error("Subscription check error:", error);
      throw new Error("Failed to verify subscription.");
  }

  if (!subscription) {
      throw new Error("No subscription found. Please upgrade to a paid plan.");
  }

  const { status, current_period_end, cancel_at_period_end, plan } = subscription;
  const now = new Date();
  const periodEnd = new Date(current_period_end);

  // Grace period: 2 hours buffer for webhook delays
  const GRACE_PERIOD_MS = 2 * 60 * 60 * 1000; // 2 hours
  const periodEndWithGrace = new Date(periodEnd.getTime() + GRACE_PERIOD_MS);

  // 1. PAUSED → Blocked but can be resumed
  if (status === 'paused') {
    throw new Error("Your subscription is paused. Resume your plan from the Profile page to continue.");
  }
  
  // 2. CANCELED → Blocked
  if (status === 'canceled') {
    throw new Error("Your subscription has been canceled. Please subscribe again to regain access.");
  }

  // 3. PAST DUE → Blocked (payment failure)
  if (status === 'past_due') {
    throw new Error("Your subscription has a payment issue. Please update your payment method or contact support.");
  }

  // 4. ACTIVE / TRIALING
  if (status === 'active' || status === 'trialing') {
    // Check if period has actually expired (with grace period)
    if (now > periodEndWithGrace) {
      // Active but period ended and grace period passed
      throw new Error("Your subscription period has ended. Please renew to continue.");
    }

    // If cancel_at_period_end is true, still allow access until period ends
    // (The user cancelled but period hasn't ended yet)

    return {
      isValid: true,
      razorpayPlanId: plan?.razorpay_plan_id,
      planName: plan?.name,
      cancelAtPeriodEnd: cancel_at_period_end || false,
      periodEnd: current_period_end
    };
  }

  // Fallback: Unknown status
  throw new Error(`Invalid subscription status: ${status}. Please contact support.`);
}
