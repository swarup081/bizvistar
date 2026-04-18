'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import RAZORPAY_CONFIG, { getPlanId, getKeyId, getRazorpayMode, getStandardPlanId, COUPON_CONFIG } from '../config/razorpay-config';

// Lazy Initialize Supabase Admin
const getSupabaseAdmin = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
};

// Helper to get authenticated user
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

  // Fallback to cookies
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

// Check if user has already used a specific coupon
async function hasUserUsedCoupon(userId, couponCode) {
    const supabaseAdmin = getSupabaseAdmin();
    // Check 'subscriptions' table metadata
    // We look for any subscription where metadata->>'coupon_used' matches the code
    const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('metadata->>coupon_used', couponCode)
        .limit(1);

    if (error) {
        console.error("Error checking coupon usage:", error);
        return false; // Fail open (allow) or close? Safer to fail close if critical, but let's log.
    }
    
    return data && data.length > 0;
}

// Check if user has ANY prior subscriptions (for 'first_time_only' coupons)
async function hasPriorSubscriptions(userId) {
    const supabaseAdmin = getSupabaseAdmin();
    const { count, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
        
    if (error) return false;
    return count > 0;
}


// Counts how many times a coupon has been used in ACTIVE subscriptions (Global Limit)
async function getCouponUsageCount(couponCode) {
    const supabaseAdmin = getSupabaseAdmin();
    
    // For global limits like FOUNDER (50 users)
    // We can rely on the plan ID logic or metadata.
    // Let's use metadata for consistency now.
    
    const { count, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('metadata->>coupon_used', couponCode)
        .in('status', ['active', 'past_due']); 
        
    if (error) {
        console.error("Error counting coupon usage", error);
        return 0;
    }
    return count || 0;
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
    // Ensure email is saved in billing_address JSONB
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        billing_address: billingData, // billingData now includes 'email'
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
    
    // Auth context needed for usage checks
    let user = null;
    try {
        user = await getUser(); // Try cookie auth
    } catch(e) {}

    if (config && config.active) {
        // 1. Check Expiry
        if (config.expiresAt) {
            const now = new Date();
            const expires = new Date(config.expiresAt);
            if (now > expires) {
                return { valid: false, message: "Coupon Expired" };
            }
        }
        
        // 2. Check Global Limit (FOUNDER)
        if (config.limit) {
            const currentUsage = await getCouponUsageCount(normalized);
            if (currentUsage >= config.limit) {
                 return { valid: false, message: "Coupon Usage Limit Reached" };
            }
        }

        // 3. Check User-Specific Constraints (if user is logged in)
        // If user not logged in, we might skip this or optimistically allow, 
        // enforcing it later at createSubscription.
        // We will optimistically allow here but enforce strictly at createSubscriptionAction.
        
        return { 
            valid: true, 
            type: config.type, 
            description: config.description,
            code: normalized,
            percentOff: config.percentOff,
            maxDiscount: config.maxDiscount
        };
    }
    
    return { valid: false, message: "Invalid Coupon" };
}

export async function verifyPaymentAction(paymentId, subscriptionId, signature) {
    try {
        if (!paymentId || !subscriptionId || !signature) {
             throw new Error("Missing verification parameters");
        }
        
        const mode = getRazorpayMode();
        let keySecret;
        let keyId;

        if (mode === 'live') {
            // User provided: RAZORPAY_LIVE_KEY_SECRET (Standardized)
            keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;
            // Use helper or direct env var (RAZORPAY_Live_Key_ID)
            keyId = process.env.RAZORPAY_Live_Key_ID || process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID;
        } else {
            // User provided: RAZORPAY_TEST_KEY_SECRET (Standardized)
            keySecret = process.env.RAZORPAY_TEST_KEY_SECRET;
            keyId = getKeyId();
        }

        if (!keySecret) throw new Error("Server Misconfiguration: Missing Key Secret");

        // Verify using the secret retrieved based on mode
        const text = paymentId + '|' + subscriptionId;
        const generatedSignature = crypto.createHmac('sha256', keySecret).update(text).digest('hex');

        if (generatedSignature !== signature) {
             // Fallback: If verification fails, try the webhook secrets (LIVE/TEST) as a backup?
             // Razorpay Payment Verification MUST use Key Secret, not Webhook Secret.
             // But sometimes users confuse them. We will stick to Key Secret.
             // If validation fails, we throw.
            throw new Error("Invalid Signature");
        }

        // --- REDUNDANT FALLBACK: Ensure DB is updated immediately ---
        // Fetch subscription from Razorpay and update DB in case webhook is delayed/failed
        try {
            const razorpayInstance = new Razorpay({
                key_id: keyId,
                key_secret: keySecret,
            });

            const subData = await razorpayInstance.subscriptions.fetch(subscriptionId);
            
            if (subData) {
                 const status = subData.status;
                 let newStatus = 'active'; // Default to active for access
                 
                 // Map statuses
                 if (status === 'cancelled') newStatus = 'canceled';
                 if (status === 'halted') newStatus = 'past_due';
                 if (status === 'paused') newStatus = 'paused';
                 if (status === 'completed') newStatus = 'active';
                 if (status === 'authenticated') newStatus = 'active'; // Just paid

                 // Only process positive states for redundancy
                 if (['active', 'authenticated', 'completed', 'charged'].includes(status) || newStatus === 'active') {
                      const supabaseAdmin = getSupabaseAdmin();
                      
                      // Resolve User ID (from notes or session)
                      let userId = subData.notes?.user_id;
                      if (!userId) {
                          const user = await getUser();
                          if (user) userId = user.id;
                      }

                      if (userId) {
                           // Resolve Internal Plan ID
                           const { data: planData } = await supabaseAdmin
                            .from('plans')
                            .select('id')
                            .eq('razorpay_plan_id', subData.plan_id)
                            .maybeSingle();

                           const upsertPayload = {
                                user_id: userId,
                                razorpay_subscription_id: subscriptionId,
                                status: newStatus, // Use mapped status
                                plan_id: planData?.id || null,
                                current_period_start: subData.current_start 
                                    ? new Date(subData.current_start * 1000).toISOString()
                                    : new Date().toISOString(),
                                current_period_end: subData.current_end 
                                    ? new Date(subData.current_end * 1000).toISOString()
                                    : new Date().toISOString(),
                                metadata: {
                                    coupon_used: subData.notes?.coupon_used,
                                    notes: subData.notes
                                }
                           };
                           
                           // Deactivate old subscriptions for this user before creating new one
                           // This prevents duplicate active subs when user upgrades/changes plans
                           await supabaseAdmin
                             .from('subscriptions')
                             .update({ status: 'canceled', metadata: { superseded_by: subscriptionId, superseded_at: new Date().toISOString() } })
                             .eq('user_id', userId)
                             .in('status', ['active', 'trialing'])
                             .neq('razorpay_subscription_id', subscriptionId);

                           // Upsert Subscription
                           await supabaseAdmin.from('subscriptions').upsert(upsertPayload, { onConflict: 'razorpay_subscription_id' });

                           // Publish Website
                           const { data: website } = await supabaseAdmin
                             .from('websites')
                             .select('id, website_data, draft_data')
                             .eq('user_id', userId)
                             .limit(1)
                             .maybeSingle();

                           if (website) {
                               const updates = { is_published: true };
                               // Copy draft to published if empty
                               if (!website.website_data || (typeof website.website_data === 'object' && Object.keys(website.website_data).length === 0)) {
                                   updates.website_data = website.draft_data;
                               }
                               await supabaseAdmin.from('websites').update(updates).eq('id', website.id);
                               console.log(`[Redundant Check] Website published for user ${userId}`);
                           }
                      }
                 }
            }

        } catch (redundantErr) {
            console.error("Redundant verification update failed:", redundantErr);
            // Swallow error so we don't block the user if signature was valid
        }

        return { success: true };

    } catch (err) {
        console.error("Payment Verification Failed:", err);
        return { success: false, error: "Payment verification failed" };
    }
}

/**
 * Creates a subscription safely.
 */
export async function createSubscriptionAction(planName, billingCycle, couponCode, accessToken = null) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const user = await getUser(accessToken);
    if (!user) throw new Error("Unauthorized");
    
    const standardPlanId = getStandardPlanId(planName, billingCycle);
    if (!standardPlanId) throw new Error("Plan not found in configuration.");

    const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : '';
    const finalPlanId = getPlanId(standardPlanId, couponCode); 
    
    // 1. Check for Existing Active Subscription
    // 1. Fetch Existing Active Subscription to possibly cancel it later or just log it
    // For now, Razorpay will handle a new subscription being created. 
    // We will cancel the old one via webhook or let the user have multiple if they didn't explicitly upgrade.
    // However, since they requested an upgrade path, we allow creating a new one.
    // We remove the hard block to enable upgrades.
    const { data: existingSubs } = await supabaseAdmin
        .from('subscriptions')
        .select('razorpay_subscription_id, status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing']);

    // Pass the old subscription ID in notes so webhook knows to cancel it
    let oldSubId = null;
    if (existingSubs && existingSubs.length > 0) {
        oldSubId = existingSubs[0].razorpay_subscription_id;
    }

    const couponConfig = COUPON_CONFIG[normalizedCoupon];
    const mode = getRazorpayMode();
    const keyId = getKeyId();

    // Fetch Billing Details for Notes
    let billingNotes = {};
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('billing_address')
        .eq('id', user.id)
        .single();
    
    if (profile && profile.billing_address) {
        const b = profile.billing_address;
        // Razorpay Notes: keys/values must be strings
        billingNotes = {
            customer_name: b.fullName || '',
            customer_email: b.email || '',
            customer_phone: b.phoneNumber || '',
            customer_gst: b.gstNumber || '',
            customer_address: `${b.address || ''}, ${b.city || ''}, ${b.state || ''}, ${b.zipCode || ''}`.substring(0, 250) // Truncate to fit
        };
    }
    
    // --- ENFORCE SECURITY CONTROLS ---
    if (couponConfig) {
        // 1. Check Global Limit again
        if (couponConfig.limit) {
             const usage = await getCouponUsageCount(normalizedCoupon);
             if (usage >= couponConfig.limit) throw new Error("Coupon limit reached.");
        }

        // 2. Check 'once_per_user'
        if (couponConfig.usageType === 'once_per_user') {
            const used = await hasUserUsedCoupon(user.id, normalizedCoupon);
            if (used) throw new Error(`You have already used the coupon '${normalizedCoupon}'.`);
        }

        // 3. Check 'first_time_only'
        if (couponConfig.usageType === 'first_time_only') {
            const hasPrior = await hasPriorSubscriptions(user.id);
            if (hasPrior) throw new Error(`The coupon '${normalizedCoupon}' is for new customers only.`);
        }
    }

    // Initialize Razorpay
    let razorpayInstance;
    if (mode === 'live') {
         razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_Live_Key_ID || process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
            key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
        });
    } else {
         const configKeyId = getKeyId();
         razorpayInstance = new Razorpay({
            key_id: configKeyId,
            key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
        });
    }

    let totalCount = 120; // Default 10 years
    let offerId = null;
    let startAt = null;

    if (normalizedCoupon === 'FOUNDER') {
        if (billingCycle === 'monthly') {
            totalCount = 12; 
        } else if (billingCycle === 'yearly') {
            totalCount = 1; 
        }
    }

    if (couponConfig && couponConfig.type === 'offer_apply' && couponConfig.offerIds) {
        offerId = couponConfig.offerIds[mode];
        if (!offerId) throw new Error("Offer not available in this mode");
    }

    if (couponConfig && couponConfig.type === 'trial_period') {
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
        billing_cycle: billingCycle,
        old_subscription_id: oldSubId || '', // Pass old sub ID to cancel on success
        ...billingNotes
        // We pass coupon_used here so webhook can pick it up
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
      offerId: offerId 
    };

  } catch (err) {
    console.error("Error creating subscription:", err);
    return { success: false, error: err.message };
  }
}
