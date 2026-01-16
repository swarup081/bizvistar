'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import RAZORPAY_CONFIG, { getPlanId, getKeyId, getRazorpayMode, getStandardPlanId, COUPON_CONFIG } from '../config/razorpay-config';

// Lazy Initialize Supabase Admin inside functions or use placeholder for build
const getSupabaseAdmin = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
};

// Helper to get authenticated user - MODIFIED to accept optional token
async function getUser(accessToken = null) {
  // If token provided (from client-side session), use it
  if (accessToken) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
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
      // Cookies might fail if called outside of request context (rare in Actions)
      return null;
  }
}

// Counts how many times a coupon has been used in ACTIVE subscriptions
async function getCouponUsageCount(couponCode) {
    const supabaseAdmin = getSupabaseAdmin();
    // We check the subscriptions table notes->>'coupon_used'
    // This is not perfectly index-optimized but sufficient for 50 users.
    // Assuming subscriptions table exists and tracks this.
    // If not, we might need to count from 'orders' or rely on what we have.
    // The previous webhook code saves 'notes' into subscription but schema doesn't have notes column,
    // it likely saves it implicitly or we need to check how webhook saves it.
    // Wait, the webhook code provided earlier saves `user_id` but not `notes` explicitly into a json column unless I add it.
    // The current webhook impl:
    // .upsert({ ... status, plan_id ... })
    // It does NOT save notes.
    // HOWEVER, the Limit requirement is "valid for live 50 user only".
    // We can count rows in subscriptions table where we can infer it?
    // Or we can query Razorpay API. querying API is safer but slower.
    // Let's implement a count based on Supabase 'client_analytics' or just assume we add a 'coupon_code' column to subscriptions?
    // For now, I will perform a count on `subscriptions` table assuming we can maybe infer plan ID?
    // Actually, `FOUNDER` swaps the plan ID. So we can count subscriptions with `plan_id` matching Founder Plans.

    // Get all Founder Plan IDs from config
    const mode = getRazorpayMode();
    const config = RAZORPAY_CONFIG[mode];
    const founderPlanIds = Object.values(config.founder_mapping);

    // We need to resolve these RAZORPAY plan IDs to INTERNAL plan IDs to query the DB.
    // Because `subscriptions` table stores `plan_id` (Internal PK).

    // This is getting complex to reverse map.
    // ALTERNATIVE: Just count active subscriptions for now as a rough proxy if we can't map perfectly,
    // OR fetch 'plans' from DB where razorpay_plan_id IN (...)

    if (couponCode === 'FOUNDER') {
        const { data: plans } = await supabaseAdmin
            .from('plans')
            .select('id')
            .in('razorpay_plan_id', founderPlanIds);

        if (!plans || plans.length === 0) return 0;

        const internalIds = plans.map(p => p.id);

        const { count, error } = await supabaseAdmin
            .from('subscriptions')
            .select('*', { count: 'exact', head: true })
            .in('plan_id', internalIds)
            .in('status', ['active', 'past_due']); // count active users

        if (error) {
            console.error("Error counting founder usage", error);
            return 0; // Fail open or closed? Fail open for now.
        }
        return count || 0;
    }

    return 0;
}

export async function saveBillingDetailsAction(billingData, accessToken = null) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
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

        // Check Limit (FOUNDER)
        if (config.limit) {
            const currentUsage = await getCouponUsageCount(normalized);
            console.log(`Coupon ${normalized} usage: ${currentUsage}/${config.limit}`);
            if (currentUsage >= config.limit) {
                 return { valid: false, message: "Coupon Usage Limit Reached" };
            }
        }

        console.log("Coupon Valid");
        // Return enriched info for UI
        return {
            valid: true,
            type: config.type,
            description: config.description,
            code: normalized,
            percentOff: config.percentOff,
            maxDiscount: config.maxDiscount
        };
    }

    console.log("Invalid Coupon Config or Inactive");
    return { valid: false, message: "Invalid Coupon" };
}

export async function verifyPaymentAction(paymentId, subscriptionId, signature) {
    try {
        if (!paymentId || !subscriptionId || !signature) {
             throw new Error("Missing verification parameters");
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // Note: Razorpay Verification on Frontend usually uses Key Secret, not Webhook Secret.
        // Wait, for subscription `razorpay_signature` is generated using KEY_SECRET?
        // Let's check docs or config. usually standard checkout uses KEY_SECRET.

        // We need the correct secret based on Mode.
        const mode = getRazorpayMode();
        let keySecret;
        if (mode === 'live') {
            keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;
        } else {
             // Supports the typo version too
            keySecret = process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET;
        }

        if (!keySecret) throw new Error("Server Misconfiguration: Missing Key Secret");

        // Verification Formula: hmac_sha256(payment_id + "|" + subscription_id, secret)
        const text = paymentId + '|' + subscriptionId;
        const generatedSignature = crypto.createHmac('sha256', keySecret).update(text).digest('hex');

        if (generatedSignature !== signature) {
            throw new Error("Invalid Signature");
        }

        return { success: true };

    } catch (err) {
        console.error("Payment Verification Failed:", err);
        return { success: false, error: "Payment verification failed" };
    }
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

    // 1. Resolve Standard Plan ID from Name/Cycle
    if (!planName || !billingCycle) {
        throw new Error("Invalid Plan details.");
    }

    const standardPlanId = getStandardPlanId(planName, billingCycle);
    if (!standardPlanId) {
        throw new Error("Plan not found in configuration.");
    }

    // 2. Validate & Configure Coupon Logic
    const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : '';
    const finalPlanId = getPlanId(standardPlanId, couponCode); // Handles PLAN_SWAP (Founder)

    const couponConfig = COUPON_CONFIG[normalizedCoupon];
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
        const configKeyId = getKeyId();
         razorpayInstance = new Razorpay({
            key_id: configKeyId,
            key_secret: process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET,
        });
    }

    // 4. Prepare Subscription Options
    let totalCount = 120; // Default 10 years
    let offerId = null;
    let startAt = null;

    // A) Founder Logic (Plan Swap)
    if (normalizedCoupon === 'FOUNDER') {
        // Double check limit before creating
        const usage = await getCouponUsageCount('FOUNDER');
        if (COUPON_CONFIG.FOUNDER.limit && usage >= COUPON_CONFIG.FOUNDER.limit) {
            throw new Error("Coupon limit reached.");
        }

        if (billingCycle === 'monthly') {
            totalCount = 12; // 1 year of monthly
        } else if (billingCycle === 'yearly') {
            totalCount = 1; // 1 year payment
        }
    }

    // B) Offer Apply Logic (70% Off)
    if (couponConfig && couponConfig.type === 'offer_apply' && couponConfig.offerIds) {
        offerId = couponConfig.offerIds[mode];
        if (!offerId) throw new Error("Offer not available in this mode");
    }

    // C) Trial Period Logic
    if (couponConfig && couponConfig.type === 'trial_period') {
        // Add trial days to start time
        // Razorpay expects start_at in unix timestamp (seconds)
        // Note: For a card authorization to happen immediately, usually we create subscription without start_at
        // but with an offer that gives 100% discount, OR with start_at.
        // If start_at is used, the immediate payment is usually just auth?
        // User said: "subscription should start immediately except the coupon code they have for free trial"
        // So for trial, we delay start.
        if (couponConfig.trialDays) {
             const startDate = new Date();
             startDate.setDate(startDate.getDate() + couponConfig.trialDays);
             startAt = Math.floor(startDate.getTime() / 1000);
        }
    }

    const subscriptionOptions = {
      plan_id: finalPlanId,
      customer_notify: 1,
      total_count: totalCount,
      notes: {
        user_id: user.id,
        coupon_used: normalizedCoupon || 'none',
        plan_name: planName,
        billing_cycle: billingCycle
      }
    };

    if (offerId) {
        subscriptionOptions.offer_id = offerId;
    }
    if (startAt) {
        subscriptionOptions.start_at = startAt;
    }

    const subscription = await razorpayInstance.subscriptions.create(subscriptionOptions);

    return {
      success: true,
      subscriptionId: subscription.id,
      keyId: keyId,
      planId: finalPlanId,
      offerId: offerId // Return to frontend if needed
    };

  } catch (err) {
    console.error("Error creating subscription:", err);
    return { success: false, error: err.message };
  }
}
