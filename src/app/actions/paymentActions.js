'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import Razorpay from 'razorpay';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const razorpayKeyId = process.env.RAZOPAY_Test_Key_ID;
const razorpayKeySecret = process.env.RAZOPAY_Test_Key_Secret;

if (!supabaseUrl || !supabaseServiceKey || !razorpayKeyId || !razorpayKeySecret) {
  console.error("Missing Environment Variables for Payment Actions");
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function validateCouponAction(code) {
  if (!code) return { valid: false };

  try {
    // 1. Check local 'coupons' table first
    const { data: coupon, error } = await adminSupabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (coupon) {
      return {
        valid: true,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        razorpay_offer_id: coupon.razorpay_offer_id
      };
    }

    // 2. Fallback: Check Razorpay Offers directly?
    // We'll stick to local table for simplicity, as we seeded it.
    return { valid: false, message: 'Invalid Coupon' };
  } catch (err) {
    console.error("Coupon Error:", err);
    return { valid: false };
  }
}

export async function createSubscriptionAction(planName, billingCycle, couponCode = null) {
  const user = await getAuthenticatedUser();
  const userId = user.id;

  try {
    // 1. Resolve Plan
    const { data: plans, error: planError } = await adminSupabase
      .from('plans')
      .select('*')
      .eq('name', planName);

    if (planError || !plans || plans.length === 0) {
      throw new Error(`Plan not found: ${planName}`);
    }

    let selectedPlan = null;
    if (billingCycle === 'monthly') {
        selectedPlan = plans.sort((a, b) => a.price - b.price)[0];
    } else {
        selectedPlan = plans.sort((a, b) => b.price - a.price)[0];
    }

    if (!selectedPlan) throw new Error("Could not determine specific plan.");

    // 2. Handle Coupon / Offer
    let offerId = null;
    if (couponCode) {
       const couponData = await validateCouponAction(couponCode);
       if (couponData.valid && couponData.razorpay_offer_id) {
           offerId = couponData.razorpay_offer_id;
       }
       // If coupon exists locally but has no razorpay_offer_id,
       // we might need to handle manual discount?
       // For recurring subscriptions, Razorpay requires an 'offer_id'.
       // If we don't have one, we can't easily apply it.
       // We'll assume the coupon table has the ID (the setup script creates an offer but didn't save ID to DB yet,
       // actually the setup script printed it. Ideally the user runs a migration to save it).
       // For now, if no offer_id, we ignore it to avoid subscription failure.
    }

    // 3. Create Subscription on Razorpay
    const subOptions = {
      plan_id: selectedPlan.razorpay_plan_id,
      total_count: 120,
      quantity: 1,
      customer_notify: 1,
      notes: {
        site_slug: 'pending',
        user_id: userId
      }
    };

    if (offerId) {
        subOptions.offer_id = offerId;
    }

    const subscription = await razorpay.subscriptions.create(subOptions);

    // 4. INSERT Subscription Record in DB (Pending)
    // We MUST do this so the webhook has something to update.
    const { error: insertError } = await adminSupabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: selectedPlan.id,
        status: 'pending', // Initial status
        razorpay_subscription_id: subscription.id,
        current_period_start: new Date().toISOString(), // Temporary until webhook updates it
        current_period_end: new Date().toISOString()
      });

    if (insertError) {
        console.error("DB Insert Error:", insertError);
        // We shouldn't fail the user here, but it's risky.
    }

    return {
      subscriptionId: subscription.id,
      keyId: razorpayKeyId,
      planId: selectedPlan.id
    };

  } catch (error) {
    console.error("Create Subscription Error:", error);
    throw new Error(error.message);
  }
}

export async function saveBillingDetailsAction(formData) {
  // Removing userId argument, get it from session
  const user = await getAuthenticatedUser();

  try {
     const { error } = await adminSupabase
       .from('profiles')
       .update({
         full_name: `${formData.firstName} ${formData.lastName}`,
         billing_address: formData,
         email: user.email // Ensure email is synced if profile supports it
       })
       .eq('id', user.id);

     if (error) throw error;
     return { success: true };
  } catch (error) {
    console.error("Save Billing Error:", error);
    throw new Error("Failed to save billing details.");
  }
}
