import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as crypto from "https://deno.land/std@0.177.0/node/crypto.ts";

const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");

serve(async (req) => {
  try {
    if (!WEBHOOK_SECRET) {
        console.error("Missing RAZORPAY_WEBHOOK_SECRET env var");
        return new Response("Configuration Error", { status: 500 });
    }
    // 1. Validate Request Method
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // 2. Verify Signature
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    const bodyText = await req.text();
    // Verify using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;
    console.log(`Received Webhook Event: ${event}`);

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Handle Events
    switch (event) {
      case "subscription.activated":
      case "subscription.charged":
        await handleSubscriptionActive(supabase, payload);
        break;

      case "subscription.cancelled":
      case "subscription.halted":
        await handleSubscriptionCancelled(supabase, payload);
        break;

      case "payment.failed":
        // Optional: Log failure or notify user
        console.log("Payment failed for subscription:", payload.payload.subscription.entity.id);
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

async function handleSubscriptionActive(supabase, payload) {
  const subData = payload.payload.subscription.entity;
  const razorpay_sub_id = subData.id;
  const status = subData.status; // 'active'
  const current_start = new Date(subData.current_start * 1000).toISOString();
  const current_end = new Date(subData.current_end * 1000).toISOString();

  // Update the subscriptions table
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: current_start,
      current_period_end: current_end,
      // If we need to capture the plan_id from the payload, we can do that too
      // but usually the subscription row already exists with the plan_id
    })
    .eq('razorpay_subscription_id', razorpay_sub_id);

  if (error) {
    console.error('Error updating subscription (Active):', error);
  } else {
    console.log(`Subscription ${razorpay_sub_id} activated/charged.`);

    // Optionally: Update User's Website status to 'published' or similar if needed
    // But for now we just track subscription status.
  }
}

async function handleSubscriptionCancelled(supabase, payload) {
  const subData = payload.payload.subscription.entity;
  const razorpay_sub_id = subData.id;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled'
    })
    .eq('razorpay_subscription_id', razorpay_sub_id);

  if (error) {
    console.error('Error updating subscription (Cancelled):', error);
  } else {
    console.log(`Subscription ${razorpay_sub_id} cancelled.`);
  }
}
