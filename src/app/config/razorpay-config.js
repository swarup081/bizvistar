
// Coupon Configuration
export const COUPON_CONFIG = {
    'FOUNDER': {
        active: true, // Master switch to enable/disable
        expiresAt: '2025-12-31T23:59:59Z', // Optional: Set expiry date
        limit: 1000 // Optional: Could implement DB check against this
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

       // Additional mapping if the other starter yearly ID is used (from previous context)
      'plan_S4BD17xQeMYcNn': 'plan_S4BLw6F1nsWNOZ'
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

       // Duplicate starter yearly handling
      'plan_S2wsIi1wd8y1zh': 'plan_S4E0T975OQgHl7'
    }
  }
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
    return process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID || 'rzp_test_invalid';
};

export default RAZORPAY_CONFIG;
