
// Coupon Configuration
export const COUPON_CONFIG = {
    'FOUNDER': {
        active: true,
        expiresAt: '2030-12-31T23:59:59Z', 
        limit: 50, 
        description: 'Founder Plan (1 Year Access)',
        type: 'plan_swap',
        usageType: 'once_per_user' // Can only be used once ever by a user
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
        usageType: 'once_per_user', // "user can opt once but not needed that if it is there first time"
        // Offer IDs mapped by Mode
        offerIds: {
            test: 'offer_S4Bsf2tMH8hFsz',
            live: 'offer_S4CUbc3yLhHMuJ'
        }
    }
};

const RAZORPAY_CONFIG = {
  test: {
    // Standard Plans
    starter_monthly: 'plan_S4BFGXTRu7GHxX',
    pro_monthly: 'plan_S4BDgrDG7ivKeR',
    growth_monthly: 'plan_S4BDMsmUjZXCOM',
    starter_yearly: 'plan_S4BEoNbwUVfQNB',
    pro_yearly: 'plan_S4BCYI3fjqbilb',
    growth_yearly: 'plan_S4BBdtWGIXxqLI',

    // Founder Plan Mappings (Standard ID -> Founder ID)
    founder_mapping: {
      'plan_S4BFGXTRu7GHxX': 'plan_S4BHEcxdqLcMDj', // Starter Monthly (199 map)
      'plan_S4BDgrDG7ivKeR': 'plan_S4BI0mDKImpPzI', // Pro Monthly
      'plan_S4BDMsmUjZXCOM': 'plan_S4BIhjpwKwAxug', // Growth Monthly
      'plan_S4BEoNbwUVfQNB': 'plan_S4BLw6F1nsWNOZ', // Starter Yearly
      'plan_S4BCYI3fjqbilb': 'plan_S4BML6ujolcNKl', // Pro Yearly
      'plan_S4BBdtWGIXxqLI': 'plan_S4BNHI0KqufC0j', // Growth Yearly
    }
  },
  live: {
    // Standard Plans
    starter_monthly: 'plan_S2wpNAAtmppvUG',
    pro_monthly: 'plan_S2wqCR4HPKMqwM',
    growth_monthly: 'plan_S2wqkKaf1HsR4x',
    starter_yearly: 'plan_S2wt1MCSq8rzxV',
    pro_yearly: 'plan_S2wwwLSSoAU9bY',
    growth_yearly: 'plan_S2wxhv68uVGCPj',

    // Founder Plan Mappings
    founder_mapping: {
      'plan_S2wpNAAtmppvUG': 'plan_S4EIqVlt6wVfKf', // Starter Monthly
      'plan_S2wqCR4HPKMqwM': 'plan_S4EJFMkgqhdXUi', // Pro Monthly
      'plan_S2wqkKaf1HsR4x': 'plan_S4EJc0Q2xYvaJh', // Growth Monthly
      'plan_S2wt1MCSq8rzxV': 'plan_S4E0T975OQgHl7', // Starter Yearly
      'plan_S2wwwLSSoAU9bY': 'plan_S4ENyxLkjJcDUT', // Pro Yearly
      'plan_S2wxhv68uVGCPj': 'plan_S4ENY18sw6dq6U', // Growth Yearly
    }
  }
};

export const PLAN_LIMITS = {
    // Starter Plans (Limit 25)
    'starter': 25,
    // Others (Unlimited = -1)
    'pro': -1,
    'growth': -1
};

/**
 * Retrieves the current Razorpay configuration mode ('test' or 'live').
 */
export const getRazorpayMode = () => {
  return process.env.NEXT_PUBLIC_RAZORPAY_MODE || 'test';
};

/**
 * Helper to resolve "Standard" Plan ID from generic names.
 */
export const getStandardPlanId = (planName, billingCycle) => {
    const mode = getRazorpayMode();
    const config = RAZORPAY_CONFIG[mode];
    const key = `${planName.toLowerCase()}_${billingCycle.toLowerCase()}`; // e.g., 'starter_monthly'
    return config[key] || null;
};

export const getPlanId = (planId, coupon) => {
  const mode = getRazorpayMode();
  const config = RAZORPAY_CONFIG[mode];
  
  if (!config) {
    throw new Error(`Invalid Razorpay Mode: ${mode}`);
  }

  const normalizedCoupon = coupon ? coupon.trim().toUpperCase() : '';
  
  // Validate Coupon
  let isValidCoupon = false;
  const couponSettings = COUPON_CONFIG[normalizedCoupon];
  
  if (couponSettings && couponSettings.active) {
      const now = new Date();
      const expiresAt = couponSettings.expiresAt ? new Date(couponSettings.expiresAt) : null;
      if (!expiresAt || now < expiresAt) {
          isValidCoupon = true;
      }
  }

  if (isValidCoupon && normalizedCoupon === 'FOUNDER') {
    const founderPlanId = config.founder_mapping[planId];
    if (founderPlanId) {
      return founderPlanId;
    }
  }

  return planId;
};

export const getKeyId = () => {
    const mode = getRazorpayMode();
    if (mode === 'live') {
        return process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID;
    }
    // Fallback to user provided typo variable if standard is missing
    return process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || process.env.RAZOPAY_Test_Key_ID || 'rzp_test_invalid';
};

/**
 * Helper to get limits for a given Plan ID (Standard or Founder)
 */
export const getPlanLimits = (planId) => {
    if (!planId) return { maxProducts: 0 }; // No plan = no products

    const mode = getRazorpayMode();
    const config = RAZORPAY_CONFIG[mode];

    // Reverse lookup to find the key (e.g., 'starter_monthly')
    let foundKey = null;

    // 1. Check Standard Plans
    for (const [key, id] of Object.entries(config)) {
        if (typeof id === 'string' && id === planId) {
            foundKey = key;
            break;
        }
    }

    // 2. Check Founder Plans (if not found)
    if (!foundKey && config.founder_mapping) {
         for (const [stdId, founderId] of Object.entries(config.founder_mapping)) {
             if (founderId === planId) {
                 // Found the Founder ID, now find the key for the Standard ID
                 for (const [key, id] of Object.entries(config)) {
                    if (id === stdId) {
                        foundKey = key;
                        break;
                    }
                 }
                 break;
             }
         }
    }

    if (foundKey) {
        if (foundKey.includes('starter')) return { maxProducts: PLAN_LIMITS['starter'] };
        if (foundKey.includes('pro')) return { maxProducts: PLAN_LIMITS['pro'] };
        if (foundKey.includes('growth')) return { maxProducts: PLAN_LIMITS['growth'] };
    }

    // Fallback/Default
    return { maxProducts: 25 };
};


export default RAZORPAY_CONFIG;
