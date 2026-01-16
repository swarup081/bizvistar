'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import RAZORPAY_CONFIG, { getPlanId, getKeyId, getRazorpayMode, getStandardPlanId, COUPON_CONFIG } from '../config/razorpay-config';

// Initialize Supabase Admin (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to get authenticated user - MODIFIED to accept optional token
async function getUser(accessToken = null) {
  // If token provided (from client-side session), use it
  if (accessToken) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        }
      );
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
  }

  // Fallback to cookies (if available)
  try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
      // Cookies might fail if called outside of request context (rare in Actions)
      return null;
  }
}

export async function saveBillingDetailsAction(billingData, accessToken = null) {
  try {
    const user = await getUser(accessToken);
    if (!user) throw new Error("Unauthorized");

    // Basic validation
    if (!billingData.fullName || !billingData.address || !billingData.state || !billingData.zipCode || !billingData.country) {
        throw new Error("Missing required billing fields.");
    }

    // Save to profiles
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        billing_address: billingData,
        full_name: billingData.fullName
      })
      .eq('id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error saving billing details:", err);
    return { success: false, error: err.message };
  }
}

export async function validateCouponAction(couponCode) {
    const normalized = couponCode ? couponCode.trim().toUpperCase() : '';
    console.log(`Validating Coupon: '${couponCode}' -> '${normalized}'`);
    const config = COUPON_CONFIG[normalized];

    if (config && config.active) {
        // Check Expiry
        if (config.expiresAt) {
            const now = new Date();
            const expires = new Date(config.expiresAt);
            if (now > expires) {
                console.log("Coupon Expired");
                return { valid: false, message: "Coupon Expired" };
            }
        }
        console.log("Coupon Valid");
        return { valid: true };
    }

    console.log("Invalid Coupon Config or Inactive");
    return { valid: false, message: "Invalid Coupon" };
}

/**
 * Creates a subscription safely.
 * @param {string} planName - "Starter", "Pro", "Growth"
 * @param {string} billingCycle - "monthly", "yearly"
 * @param {string} couponCode - optional
 * @param {string} accessToken - optional (for client-side auth bridging)
 */
export async function createSubscriptionAction(planName, billingCycle, couponCode, accessToken = null) {
  try {
    const user = await getUser(accessToken);
    if (!user) throw new Error("Unauthorized");

    // 1. Resolve Standard Plan ID from Name/Cycle (SECURITY: user cannot inject random ID)
    if (!planName || !billingCycle) {
        throw new Error("Invalid Plan details.");
    }

    const standardPlanId = getStandardPlanId(planName, billingCycle);
    if (!standardPlanId) {
        throw new Error("Plan not found in configuration.");
    }

    // 2. Resolve Final Plan ID (Apply Coupon logic safely)
    const finalPlanId = getPlanId(standardPlanId, couponCode);
    const mode = getRazorpayMode();
    const keyId = getKeyId();

    // 3. Initialize Razorpay
    let razorpayInstance;

    if (mode === 'live') {
         razorpayInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
            key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
        });
    } else {
         razorpayInstance = new Razorpay({
            key_id: process.env.RAZOPAY_Test_Key_ID || process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
            key_secret: process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET,
        });
    }

    // 4. Create Subscription on Razorpay
    let totalCount = 120; // Default to 10 years (long-term auto-renewal)

    // enforce 1-year limit for Founder plans as requested
    const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : '';
    if (normalizedCoupon === 'FOUNDER') {
        if (billingCycle === 'monthly') {
            totalCount = 12; // 1 year of monthly payments
        } else if (billingCycle === 'yearly') {
            totalCount = 1; // 1 year payment
        }
    }

    const subscriptionOptions = {
      plan_id: finalPlanId,
      customer_notify: 1,
      total_count: totalCount,
      notes: {
        user_id: user.id,
        coupon_used: couponCode || 'none',
        plan_name: planName,
        billing_cycle: billingCycle
      }
    };

    const subscription = await razorpayInstance.subscriptions.create(subscriptionOptions);

    return {
      success: true,
      subscriptionId: subscription.id,
      keyId: keyId,
      planId: finalPlanId
    };

  } catch (err) {
    console.error("Error creating subscription:", err);
    return { success: false, error: err.message };
  }
}
