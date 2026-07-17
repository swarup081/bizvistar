
// Coupon Configuration
export const COUPON_CONFIG = {
  'FOUNDER': {
      active: false, // DEACTIVATED — no new FOUNDER signups
      expiresAt: '2030-12-31T23:59:59Z', 
      limit: 50, 
      description: 'Founder Plan (1 Year Access)',
      type: 'plan_swap',
      usageType: 'once_per_user'
  },
  'FREETRIAL': { // 1 Month Free Trial
      active: true,
      description: '1 Month Free Trial',
      type: 'trial_period',
      trialDays: 30,
      usageType: 'first_time_only' // Only for new users (no prior subs)
  },
  'SAVE70': { // 70% Off First Month
      active: true,
      description: '70% Off First Month',
      type: 'offer_apply',
      percentOff: 70,
      maxDiscount: 1300,
      usageType: 'once_per_user',
      offerIds: {
          test: 'offer_S4Bsf2tMH8hFsz',
          live: 'offer_S4CUbc3yLhHMuJ'
      }
  }
};

// ─── FREEMIUM MODEL ───
// Tiers: Free (Starter) → Pro (₹299) → Growth (₹799)
// Old Starter IDs (₹299) are now Pro. Old Pro IDs (₹799) are now Growth.
// Old Growth tier (₹1499) is REMOVED.
const RAZORPAY_CONFIG = {
test: {
  // Pro Plans (₹299/mo, ₹2990/yr) — reusing old Starter plan IDs
  pro_monthly: 'plan_S4BFGXTRu7GHxX',
  pro_yearly: 'plan_S4BEoNbwUVfQNB',
  // Growth Plans (₹799/mo, ₹7990/yr) — reusing old Pro plan IDs
  growth_monthly: 'plan_S4BDgrDG7ivKeR',
  growth_yearly: 'plan_S4BCYI3fjqbilb',
},
live: {
  // Pro Plans (₹299/mo, ₹2990/yr) — reusing old Starter plan IDs
  pro_monthly: 'plan_S2wpNAAtmppvUG',
  pro_yearly: 'plan_S2wt1MCSq8rzxV',
  // Growth Plans (₹799/mo, ₹7990/yr) — reusing old Pro plan IDs
  growth_monthly: 'plan_S2wqCR4HPKMqwM',
  growth_yearly: 'plan_S2wwwLSSoAU9bY',
}
};

// Free tier identifier used in subscription records
export const FREE_TIER_PLAN_ID = 'free_tier_plan';
export const FREE_TIER_SUB_PREFIX = 'free_tier_';

/**
 * Check if a razorpay_subscription_id belongs to a free tier subscription
 */
export const isFreeTierSubscription = (razorpaySubId) => {
  return razorpaySubId && razorpaySubId.startsWith(FREE_TIER_SUB_PREFIX);
};

/**
 * Check if a plan name is the free tier
 */
export const isFreeTierPlan = (planName) => {
  if (!planName) return false;
  const lower = planName.toLowerCase();
  return lower.includes('starter free') || lower.includes('free');
};

export const PLAN_LIMITS = {
  // Starter / Free (Limit 25 products)
  'starter': 25,
  // Pro (Unlimited = -1)
  'pro': -1,
  // Growth (Unlimited = -1)
  'growth': -1
};

// Template change limits per plan tier
// -1 = unlimited, 0 = not allowed, N = max per 30-day rolling window
export const TEMPLATE_CHANGE_LIMITS = {
  starter: 0,
  pro: 1,
  growth: -1
};

/**
 * Determine the plan tier ('starter', 'pro', or 'growth') from a plan name string.
 * Plan names in the DB are like "Starter Free", "Pro Monthly", "Pro Yearly", "Growth Monthly", etc.
 */
export const getPlanTierFromName = (planName) => {
  if (!planName) return 'starter'; // Default to most restrictive
  const lower = planName.toLowerCase();
  if (lower.includes('growth')) return 'growth';
  if (lower.includes('pro')) return 'pro';
  return 'starter'; // "Starter Free" and anything else
};

/**
* Retrieves the current Razorpay configuration mode ('test' or 'live').
*/
export const getRazorpayMode = () => {
return process.env.NEXT_PUBLIC_RAZORPAY_MODE || 'test';
};

/**
* Helper to resolve Plan ID from generic names.
* planName: 'pro' or 'growth' (starter is free, has no Razorpay plan)
* billingCycle: 'monthly' or 'yearly'
*/
export const getStandardPlanId = (planName, billingCycle) => {
  const mode = getRazorpayMode();
  const config = RAZORPAY_CONFIG[mode];
  const key = `${planName.toLowerCase()}_${billingCycle.toLowerCase()}`; // e.g., 'pro_monthly'
  return config[key] || null;
};

export const getPlanId = (planId, coupon) => {
const mode = getRazorpayMode();
const config = RAZORPAY_CONFIG[mode];

if (!config) {
  throw new Error(`Invalid Razorpay Mode: ${mode}`);
}

// FOUNDER coupon is deactivated — no plan swapping
// Just return the original plan ID
return planId;
};

export const getKeyId = () => {
  const mode = getRazorpayMode();
  if (mode === 'live') {
      return process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_LIVE_KEY_ID;
  }
  return process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_TEST_KEY_ID || 'rzp_test_invalid';
};

/**
* Helper to get limits for a given Plan ID (Standard or Free Tier)
*/
export const getPlanLimits = (planId) => {
  // Free tier plan
  if (!planId || planId === FREE_TIER_PLAN_ID) {
    return { maxProducts: PLAN_LIMITS['starter'] }; // 25 products
  }

  const mode = getRazorpayMode();
  const config = RAZORPAY_CONFIG[mode];
  
  // Reverse lookup to find the key (e.g., 'pro_monthly')
  let foundKey = null;

  for (const [key, id] of Object.entries(config)) {
      if (typeof id === 'string' && id === planId) {
          foundKey = key;
          break;
      }
  }

  if (foundKey) {
      if (foundKey.includes('pro')) return { maxProducts: PLAN_LIMITS['pro'] };
      if (foundKey.includes('growth')) return { maxProducts: PLAN_LIMITS['growth'] };
  }

  // Fallback: default to starter limits (most restrictive)
  return { maxProducts: PLAN_LIMITS['starter'] }; 
};


export default RAZORPAY_CONFIG;
