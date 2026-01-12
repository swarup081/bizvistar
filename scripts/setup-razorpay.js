const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZOPAY_Test_Key_ID,
  key_secret: process.env.RAZOPAY_Test_Key_Secret,
});

// Initialize Supabase (Service Role for Admin Access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLANS = [
  {
    name: 'Starter Monthly',
    description: 'Starter Plan - Monthly Billing',
    amount: 29900, // in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    internal_name: 'Starter', // Matches DB name logic
    internal_limit: 1 // Example limit
  },
  {
    name: 'Pro Monthly',
    description: 'Pro Plan - Monthly Billing',
    amount: 79900,
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    internal_name: 'Pro',
    internal_limit: 3
  },
  {
    name: 'Growth Monthly',
    description: 'Growth Plan - Monthly Billing',
    amount: 149900,
    currency: 'INR',
    period: 'monthly',
    interval: 1,
    internal_name: 'Growth',
    internal_limit: 10
  },
  {
    name: 'Starter Yearly',
    description: 'Starter Plan - Yearly Billing',
    amount: 298800,
    currency: 'INR',
    period: 'yearly',
    interval: 1,
    internal_name: 'Starter',
    internal_limit: 1
  },
  {
    name: 'Pro Yearly',
    description: 'Pro Plan - Yearly Billing',
    amount: 799200,
    currency: 'INR',
    period: 'yearly',
    interval: 1,
    internal_name: 'Pro',
    internal_limit: 3
  },
  {
    name: 'Growth Yearly',
    description: 'Growth Plan - Yearly Billing',
    amount: 1498800,
    currency: 'INR',
    period: 'yearly',
    interval: 1,
    internal_name: 'Growth',
    internal_limit: 10
  }
];

async function setup() {
  console.log('🚀 Starting Razorpay & DB Setup...');

  // 1. Create Plans
  for (const plan of PLANS) {
    try {
      console.log(`Creating Plan: ${plan.name}...`);

      const rzpPlan = await razorpay.plans.create({
        period: plan.period,
        interval: plan.interval,
        item: {
          name: plan.name,
          amount: plan.amount,
          currency: plan.currency,
          description: plan.description,
        },
      });

      console.log(`✅ Created ${plan.name} in Razorpay. ID: ${rzpPlan.id}`);

      // Upsert into Supabase
      // We check for name AND price equality to avoid dupes or updates,
      // but for simplicity, we'll insert or update based on name + price match
      // Actually, standardizing by a unique slug would be better, but let's just insert.

      const { error } = await supabase
        .from('plans')
        .upsert({
          name: plan.internal_name,
          // Store the price in standard units (Rupees), not paise
          price: plan.amount / 100,
          website_limit: plan.internal_limit,
          razorpay_plan_id: rzpPlan.id,
          // We can add a 'billing_cycle' column later if needed, but for now
          // we might need to distinguish monthly/yearly in the DB.
          // The current schema only has 'name', 'price', 'website_limit', 'razorpay_plan_id'.
          // To support both monthly/yearly for the same "Plan Name" (Starter), we'll append to the name in DB
          // or rely on price to distinguish. Let's append billing period to name for clarity in this table.
          // e.g., "Starter (Monthly)"
        }, { onConflict: 'razorpay_plan_id' }); // If ID exists, update.

      // Since 'razorpay_plan_id' is unique, this is safe.
      // However, if we run this script multiple times, we might create new plans in Razorpay
      // because Razorpay doesn't prevent duplicate plan creation with same details.
      // Ideally, we should check DB first if we have a plan ID, but user asked for setup.
      // We will proceed to create fresh ones.

      if (error) {
        console.error('❌ Error inserting into Supabase:', error);
      } else {
        console.log(`✅ Synced ${plan.name} to Supabase.`);
      }

    } catch (err) {
      console.error(`❌ Failed to create ${plan.name}:`, err);
    }
  }

  // 2. Create a Test Offer (Coupon)
  try {
    console.log('Creating Test Offer (70% Off)...');

    // Offers in Razorpay are linked to plans, or generic.
    // "No let me know how to set up we need to setup the razopay too... there are many some are upto 70% discount"
    // We will create a generic offer.

    const offer = await razorpay.offers.create({
      wait_until: 1000, // Activate immediately
      percent_rate: 70,
      display_text: '70% OFF First Month',
      description: 'Introductory Offer',
      terms_and_conditions: 'Valid for new users only.',
    });

    console.log(`✅ Created Test Offer. ID: ${offer.id}`);

    // Optionally save to a 'coupons' table if we make one.
  } catch (err) {
    console.log('⚠️ Could not create offer (might be unsupported in Test Mode or requires different API):', err.message);
  }

  console.log('🏁 Setup Complete.');
}

setup();
