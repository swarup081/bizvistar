import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
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

      if (!userId) {
        console.warn(`No user_id in subscription notes for event ${eventName}`);
        // Can't link to a user, but we acknowledge receipt.
        return NextResponse.json({ received: true });
      }

      // Determine Status
      let newStatus = 'active';
      if (eventName === 'subscription.cancelled') newStatus = 'canceled';
      if (eventName === 'subscription.halted') newStatus = 'past_due'; // or halted
      if (eventName === 'subscription.completed') newStatus = 'canceled'; // or completed
      // 'charged' and 'activated' imply active.

      // Map Status text to DB constraints: 'active', 'canceled', 'past_due'
      // If completed/halted, map to canceled/past_due appropriately.
      if (newStatus === 'completed') newStatus = 'canceled';
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

      // Upsert Subscription
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
            user_id: userId,
            razorpay_subscription_id: razorpaySubscriptionId,
            status: newStatus,
            plan_id: internalPlanId || null,
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
        }, { onConflict: 'razorpay_subscription_id' });

      if (error) {
        console.error('Error updating subscription in DB:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
      }
    }

    // --- Payment Failed (Log only) ---
    if (eventName === 'payment.failed') {
        // We can log this or trigger an email alert system if one existed.
        const payment = payload.payment.entity;
        console.log(`Payment Failed: ${payment.id} for reason: ${payment.error_description}`);
    }

    return NextResponse.json({ status: 'ok' });

  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
