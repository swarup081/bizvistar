require('dotenv').config(); // Load variables from .env by default
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  console.error('Tip: If using .env.local, run: node -r dotenv/config scripts/seed_plans.js dotenv_config_path=.env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const plans = [
  // --- LIVE MODE PLANS ---
  // Founder Plans
  { razorpay_plan_id: 'plan_S4EOT975OQgHl7', name: 'Starter Yearly Founder Plan', price: 2499, website_limit: 1, product_limit: 25 },
  { razorpay_plan_id: 'plan_S4ENyxLkjJcDUT', name: 'Pro Yearly Founder Plan', price: 3999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4ENY18sw6dq6U', name: 'Growth Yearly Founder Plan', price: 9999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4EJcOQ2xYvaJh', name: 'Growth Monthly Founder Plan', price: 999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4EJFMkgqhdXUi', name: 'Pro Monthly Founder Plan', price: 399, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4EIqVlt6wVfKf', name: 'Starter Monthly Founder Plan', price: 249, website_limit: 1, product_limit: 25 },

  // Standard Plans
  { razorpay_plan_id: 'plan_S2wxhv68uVGCPj', name: 'Growth Yearly', price: 14988, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S2wwwLSSoAU9bY', name: 'Pro Yearly', price: 7992, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S2wt1MCSq8rzxV', name: 'Starter Yearly', price: 2988, website_limit: 1, product_limit: 25 },
  { razorpay_plan_id: 'plan_S2wqkKaf1HsR4x', name: 'Growth Monthly', price: 1499, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S2wqCR4HPKMqwM', name: 'Pro Monthly', price: 799, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S2wpNAAtmppvUG', name: 'Starter Monthly', price: 299, website_limit: 1, product_limit: 25 },

  // --- TEST MODE PLANS ---
  // Founder Plans
  { razorpay_plan_id: 'plan_S4BNHI0KqufCOj', name: 'Growth Yearly Founder Plan', price: 9999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BML6ujolcNKl', name: 'Pro Yearly Founder Plan', price: 3999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BLw6F1nsWNOZ', name: 'Starter Yearly Founder Plan', price: 2499, website_limit: 1, product_limit: 25 },
  { razorpay_plan_id: 'plan_S4BKda7uxzzwUe', name: 'Starter Monthly Founder Plan', price: 249, website_limit: 1, product_limit: 25 }, // Found in user list
  { razorpay_plan_id: 'plan_S4BIhjpwKwAxug', name: 'Growth Monthly Founder Plan', price: 999, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BI0mDKImpPzI', name: 'Pro Monthly Founder Plan', price: 399, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BHEcxdqLcMDj', name: 'Starter Monthly Founder Plan', price: 199, website_limit: 1, product_limit: 25 }, // Found in config

  // Standard Plans
  { razorpay_plan_id: 'plan_S4BFGXTRu7GHxX', name: 'Starter Monthly', price: 299, website_limit: 1, product_limit: 25 },
  { razorpay_plan_id: 'plan_S4BEoNbwUVfQNB', name: 'Starter Yearly', price: 2988, website_limit: 1, product_limit: 25 },
  { razorpay_plan_id: 'plan_S4BDgrDG7ivKeR', name: 'Pro Monthly', price: 799, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BDMsmUjZXCOM', name: 'Growth Monthly', price: 1499, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BCYI3fjqbilb', name: 'Pro Yearly', price: 7992, website_limit: 1, product_limit: -1 },
  { razorpay_plan_id: 'plan_S4BBdtWGIXxqLI', name: 'Growth Yearly', price: 14988, website_limit: 1, product_limit: -1 },
];

async function seedPlans() {
  console.log(`Seeding ${plans.length} plans to 'public.plans'...`);

  for (const plan of plans) {
    const { error } = await supabase
      .from('plans')
      .upsert(plan, { onConflict: 'razorpay_plan_id' });

    if (error) {
      console.error(`Failed to insert plan ${plan.razorpay_plan_id}:`, error);
    } else {
      console.log(`Synced plan: ${plan.name} (${plan.razorpay_plan_id})`);
    }
  }

  console.log('Done.');
}

seedPlans();
