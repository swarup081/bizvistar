import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Lazy Initialization of Supabase inside the handler to avoid build-time errors if env vars are missing
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );

    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    // Support both Live and Test secrets provided by user
    const secretLive = process.env.RAZORPAY_WEBHOOK_SECRET_LIVE;
    const secretTest = process.env.RAZORPAY_WEBHOOK_SECRET_TEST;
    // Fallback to generic if set
    const secretGeneric = process.env.RAZORPAY_WEBHOOK_SECRET;

    const secretsToTry = [secretLive, secretTest, secretGeneric].filter(Boolean);

    if (secretsToTry.length === 0) {
      console.error('No Razorpay Webhook Secret configured (RAZORPAY_WEBHOOK_SECRET_LIVE or _TEST)');
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    // Verify Signature against any available secret
    let isValid = false;
    for (const s of secretsToTry) {
        const shasum = crypto.createHmac('sha256', s);
        shasum.update(rawBody);
        const digest = shasum.digest('hex');
        if (digest === signature) {
            isValid = true;
            break;
        }
    }

    if (!isValid) {
      console.error('Invalid Razorpay Signature (checked against available secrets)');
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { payload } = event;
    const eventName = event.event;

    console.log(`Razorpay Webhook Received: ${eventName}`);

    // --- Subscription Events ---
    if ([
        'subscription.activated', 
        'subscription.charged', 
        'subscription.cancelled', 
        'subscription.completed', 
        'subscription.halted',
        'subscription.paused',
        'subscription.resumed'
    ].includes(eventName)) {
        
      const subscription = payload.subscription.entity;
      const razorpaySubscriptionId = subscription.id;
      const razorpayPlanId = subscription.plan_id;
      const notes = subscription.notes || {};
      const userId = notes.user_id;
      const couponUsed = notes.coupon_used; // Extract coupon used

      if (!userId) {
        console.warn(`No user_id in subscription notes for event ${eventName}`);
        // Can't link to a user, but we acknowledge receipt.
        return NextResponse.json({ received: true }); 
      }

      // Determine Status
      let newStatus = 'active';
      if (eventName === 'subscription.cancelled') newStatus = 'canceled';
      if (eventName === 'subscription.halted') newStatus = 'past_due';
      
      // FIX: DB Constraint only allows 'active', 'canceled', 'past_due'
      // Map 'paused' -> 'past_due' (blocks access)
      if (eventName === 'subscription.paused') newStatus = 'past_due'; 
      
      if (eventName === 'subscription.resumed') newStatus = 'active'; 

      // FIX: Map 'completed' -> 'active' so it saves to DB. 
      // We rely on current_period_end date check in validation logic to handle actual expiry.
      if (eventName === 'subscription.completed') newStatus = 'active'; 
      
      // 'charged' and 'activated' imply active.
      // Map Status text to DB constraints: 'active', 'canceled', 'past_due', 'completed'
      // Note: 'completed' status must be allowed in DB check constraint if strict, otherwise use 'active'.
      // Assuming DB check constraint allows text, or we mapped it. 
      // The schema says: CHECK (status = ANY (ARRAY['active'::text, 'canceled'::text, 'past_due'::text]))
      // The Schema DOES NOT include 'completed'. We must handle this.
      // If DB constraint is strict, we might need to use 'active' or 'canceled'.
      // But we need to distinguish for the Founder Fix.
      // Option: Update DB constraint (SQL needed) OR map 'completed' -> 'active' but rely on date?
      // "exactly after user pay last cycle sucess and it terminate even after the payment they cant use the last cycle"
      // If we map to 'active', and current_period_end is correct, it works.
      // If we map to 'canceled', access is blocked.
      // SO: Map 'completed' -> 'active'. 
      // AND ensuring current_period_end is updated is key.
      
      if (newStatus === 'completed') newStatus = 'active'; // Map to active so DB accepts it, logic checks date.
      if (newStatus === 'halted') newStatus = 'past_due';

      // Timestamps
      // Razorpay uses unix timestamp (seconds), JS uses ms.
      const currentPeriodStart = new Date(subscription.current_start * 1000);
      const currentPeriodEnd = new Date(subscription.current_end * 1000);

      // Find Internal Plan ID
      const { data: planData } = await supabaseAdmin
        .from('plans')
        .select('id')
        .eq('razorpay_plan_id', razorpayPlanId)
        .single();
        
      let internalPlanId = planData?.id;

      // Prepare upsert payload
      const upsertPayload = {
            user_id: userId,
            razorpay_subscription_id: razorpaySubscriptionId,
            status: newStatus,
            plan_id: internalPlanId || null, 
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
            // Save metadata including coupon
            metadata: {
                coupon_used: couponUsed,
                notes: notes // save all notes just in case
            }
      };

      // Upsert Subscription
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert(upsertPayload, { onConflict: 'razorpay_subscription_id' });

      if (error) {
        console.error('Error updating subscription in DB:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
      }

      // --- PUBLISH WEBSITE (Critical Fix) ---
      // Ensure the user's website is published and accessible immediately
      if (newStatus === 'active') {
          try {
             // Fetch website to check current state
             const { data: website } = await supabaseAdmin
                 .from('websites')
                 .select('id, website_data, draft_data')
                 .eq('user_id', userId)
                 .limit(1)
                 .maybeSingle();

             if (website) {
                 const updates = { is_published: true };

                 // If published data is missing, copy from draft
                 // This ensures the user sees their content immediately
                 if (!website.website_data || (typeof website.website_data === 'object' && Object.keys(website.website_data).length === 0)) {
                     updates.website_data = website.draft_data;
                 }

                 const { error: pubError } = await supabaseAdmin
                     .from('websites')
                     .update(updates)
                     .eq('id', website.id);

                 if (pubError) {
                     console.error(`Failed to publish website for user ${userId}:`, pubError);
                 } else {
                     console.log(`Website published successfully for user ${userId}`);
                 }
             } else {
                 console.warn(`No website found for user ${userId} to publish.`);
             }
          } catch (webErr) {
              console.error("Unexpected error publishing website in webhook:", webErr);
          }
      }

      // --- BACKUP: Update Profile from Notes if missing ---
      if (userId && notes) {
          try {
               const { data: profile } = await supabaseAdmin.from('profiles').select('billing_address').eq('id', userId).single();
               if (profile && !profile.billing_address) {
                   const newBilling = {
                       fullName: notes.customer_name || '',
                       email: notes.customer_email || '',
                       phoneNumber: notes.customer_phone || '',
                       address: notes.customer_address || '',
                       gstNumber: notes.customer_gst || ''
                   };
                   await supabaseAdmin.from('profiles').update({ 
                       billing_address: newBilling,
                       full_name: newBilling.fullName || undefined
                   }).eq('id', userId);
               }
          } catch(e) { console.error("Profile sync error", e); }
      }
    }
    
    // --- Payment Failed (Log only) ---
    if (eventName === 'payment.failed') {
        const payment = payload.payment.entity;
        console.log(`Payment Failed: ${payment.id} for reason: ${payment.error_description}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
