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
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    // Verify Signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(rawBody);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('Invalid Razorpay Signature');
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
        'subscription.halted'
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
      if (eventName === 'subscription.completed') newStatus = 'completed'; // FIX: Keep as 'completed' to allow grace period check

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
