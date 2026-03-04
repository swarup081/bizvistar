'use server';

import { createClient } from '@supabase/supabase-js';

// Lazy load supabase admin to avoid build errors if env vars are missing
const getSupabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

/**
 * Validates a user's subscription status and returns their plan details.
 * Implements strict security checks and Founder Plan expiry logic.
 */
export async function validateUserSubscription(userId) {
  if (!userId) throw new Error("User ID required for subscription check.");

  // Fetch subscription with Plan details
  // Fix: Order by created_at desc to get the LATEST subscription if multiple exist (e.g. old canceled ones)
  const { data: subscription, error } = await getSupabaseAdmin()
    .from('subscriptions')
    .select(`
      status, 
      current_period_end, 
      plan:plans ( razorpay_plan_id, name )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); 

  if (error) {
      console.error("Subscription check error:", error);
      throw new Error("Failed to verify subscription.");
  }

  if (!subscription) {
      throw new Error("No subscription found. Please upgrade to a paid plan.");
  }

  const { status, current_period_end, plan } = subscription;
  const now = new Date();
  const periodEnd = new Date(current_period_end);

  // Buffer for webhook delays (e.g., 24 hours)
  // If period ended 1 hour ago, maybe give grace? 
  // But strict requirement says "exactly after user pay last cycle... terminate... cant use last cycle".
  // The fix ensures they CAN use the last cycle.
  // So strict date check is appropriate.
  // Note: periodEnd from Razorpay is usually the exact second of expiry.
  
  // 1. CANCELED / PAST DUE -> Immediate Block
  // Note: 'paused' and 'halted' are mapped to 'past_due' in webhook to satisfy DB constraints.
  if (status === 'canceled' || status === 'past_due') {
      throw new Error("Your subscription is inactive or canceled. Access denied.");
  }

  // 2. ACTIVE / TRIALLING
  // 'completed' is mapped to 'active' in webhook.
  if (status === 'active' || status === 'trialing') {
      if (now > periodEnd) {
          // If it's active but date passed, and we haven't received renewal webhook, 
          // technically they are expired or past_due.
          // For Founder plan (completed -> active), this is the correct termination point.
          throw new Error("Your subscription period has ended. Please renew.");
      }
  } else {
       throw new Error(`Invalid subscription status: ${status}`);
  }

  return {
      isValid: true,
      razorpayPlanId: plan?.razorpay_plan_id,
      planName: plan?.name
  };
}
