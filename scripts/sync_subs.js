require('dotenv').config(); // Load variables from .env by default
const { createClient } = require('@supabase/supabase-js');
const Razorpay = require('razorpay');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Test Keys
const TEST_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_TEST_KEY_ID;
const TEST_KEY_SECRET = process.env.RAZORPAY_TEST_KEY_SECRET;

// Live Keys
const LIVE_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_Live_Key_ID;
const LIVE_KEY_SECRET = process.env.RAZORPAY_LIVE_KEY_SECRET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  console.error('Tip: If using .env.local, run: node -r dotenv/config scripts/sync_subs.js dotenv_config_path=.env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncSubscriptions(mode, keyId, keySecret) {
  if (!keyId || !keySecret) {
    console.log(`Skipping ${mode} mode: Missing Key ID or Secret.`);
    return;
  }

  console.log(`Starting sync for ${mode} mode...`);
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    // Fetch last 100 subscriptions (adjust count/skip if needed)
    const subscriptions = await rzp.subscriptions.all({ count: 100 });
    console.log(`Fetched ${subscriptions.items.length} subscriptions from ${mode}.`);

    for (const sub of subscriptions.items) {
      // Resolve Internal Plan ID
      const { data: planData } = await supabase
        .from('plans')
        .select('id')
        .eq('razorpay_plan_id', sub.plan_id)
        .maybeSingle();

      const internalPlanId = planData?.id;

      if (!internalPlanId) {
        console.warn(`[${mode}] Plan ID not found in DB for Razorpay Plan: ${sub.plan_id}. Skipping Subscription ${sub.id}.`);
        continue; // Cannot insert without plan_id due to FK constraint
      }

      // Resolve User ID
      let userId = sub.notes?.user_id;
      if (!userId) {
        console.warn(`[${mode}] No user_id in notes for Subscription ${sub.id}. Skipping.`);
        continue; 
      }

      // Map Status
      let newStatus = 'active';
      const s = sub.status;
      if (s === 'cancelled') newStatus = 'canceled';
      if (s === 'halted' || s === 'paused') newStatus = 'past_due';
      if (s === 'completed') newStatus = 'active'; // or 'canceled' based on expiry? logic says active for now.
      if (s === 'created') newStatus = 'past_due'; // Created but not authenticated yet
      if (s === 'authenticated') newStatus = 'active';

      // Timestamps
      const currentPeriodStart = new Date(sub.current_start ? sub.current_start * 1000 : Date.now());
      const currentPeriodEnd = new Date(sub.current_end ? sub.current_end * 1000 : Date.now());

      const upsertPayload = {
        user_id: userId,
        razorpay_subscription_id: sub.id,
        status: newStatus,
        plan_id: internalPlanId,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        metadata: {
          notes: sub.notes,
          mode: mode,
          synced_at: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('subscriptions')
        .upsert(upsertPayload, { onConflict: 'razorpay_subscription_id' });

      if (error) {
        console.error(`[${mode}] Error upserting subscription ${sub.id}:`, error.message);
      } else {
        console.log(`[${mode}] Synced Subscription: ${sub.id} (${newStatus})`);
      }
    }

  } catch (err) {
    console.error(`[${mode}] Error fetching subscriptions:`, err);
  }
}

async function main() {
  await syncSubscriptions('TEST', TEST_KEY_ID, TEST_KEY_SECRET);
  await syncSubscriptions('LIVE', LIVE_KEY_ID, LIVE_KEY_SECRET);
  console.log('Sync Complete.');
}

main();
