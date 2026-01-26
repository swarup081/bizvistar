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
        console.warn(`[Webhook] No user_id in subscription notes for event ${eventName}`);
        // Can't link to a user, but we acknowledge receipt.
        return NextResponse.json({ received: true }); 
      }

      console.log(`[Webhook] Processing event ${eventName} for user ${userId}`);

      // Determine Status
      let newStatus = 'active'; // Default assumption

      // Map event names to status
      switch (eventName) {
          case 'subscription.cancelled':
              newStatus = 'canceled';
              break;
          case 'subscription.halted':
          case 'subscription.paused':
              newStatus = 'past_due'; // Block access
              break;
          case 'subscription.completed':
              newStatus = 'active'; // Map to active, rely on dates
              break;
          case 'subscription.charged':
          case 'subscription.activated':
          case 'subscription.resumed':
              newStatus = 'active';
              break;
          default:
              newStatus = 'active'; // Default for others like 'charged'
      }

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

      // --- PUBLISH WEBSITE LOGIC ---
      // If subscription is active, ensure website is published and data is synced
      // We do this check regardless of whether the subscription upsert succeeded (idempotent)
      if (newStatus === 'active') {
          console.log(`[Webhook] Attempting to publish website for user ${userId}`);
          try {
              const { data: website, error: findError } = await supabaseAdmin
                  .from('websites')
                  .select('id, draft_data, is_published')
                  .eq('user_id', userId)
                  .limit(1)
                  .maybeSingle();

              if (findError) {
                  console.error(`[Webhook] Error finding website for user ${userId}:`, findError);
              } else if (website) {
                  const updatePayload = { is_published: true };

                  // Promote draft_data if it exists and is not empty
                  if (website.draft_data && Object.keys(website.draft_data).length > 0) {
                      updatePayload.website_data = website.draft_data;
                  }

                  const { error: updateError } = await supabaseAdmin
                      .from('websites')
                      .update(updatePayload)
                      .eq('id', website.id);

                  if (updateError) {
                      console.error(`[Webhook] Error updating website for user ${userId}:`, updateError);
                  } else {
                      console.log(`[Webhook] Successfully published website for user ${userId}`);
                  }
              } else {
                  console.warn(`[Webhook] No website found for user ${userId} to publish.`);
              }
          } catch (e) {
              console.error("[Webhook] Unexpected error publishing website:", e);
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
