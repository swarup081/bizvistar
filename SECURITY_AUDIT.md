# Security Audit Report

**Date:** 2024-01-16
**Auditor:** BizVistar Engineering Agent

## 1. Overview
This report summarizes the security controls implemented for the Checkout and Subscription system, focusing on coupon enforcement, data persistence, and price integrity.

## 2. Implemented Controls

### A. Coupon Usage Enforcement
*   **Vulnerability:** Users could potentially reuse "one-time" coupons (e.g., `SAVE70`) by cancelling and resubscribing, or creating new accounts if not tracked properly.
*   **Fix:**
    *   Added `usageType` configuration (`once_per_user`, `first_time_only`).
    *   Implemented `hasUserUsedCoupon` check in `razorpayActions.js` which queries the `subscriptions` table `metadata->>'coupon_used'` field.
    *   Implemented `hasPriorSubscriptions` check for first-time-only coupons.
    *   **Result:** A user ID is permanently linked to used coupons via the `subscriptions` history.

### B. Price Integrity
*   **Vulnerability:** Client-side price manipulation via URL parameters or hidden fields.
*   **Fix:**
    *   Pricing logic is strictly server-side in `razorpayActions.js`.
    *   The frontend `finalPrice` is for display only. The actual subscription creation uses `plan_id` resolved on the server from the configuration map.
    *   Razorpay Signature Verification (`verifyPaymentAction`) ensures the payment response was not tampered with.

### C. Data Persistence & RLS
*   **Vulnerability:** Billing details (PII) might be exposed or not saved correctly.
*   **Fix:**
    *   Billing details are saved to the `profiles` table using a secure Server Action (`saveBillingDetailsAction`).
    *   We enforced `auth.uid()` checks (via `getUser`) to ensure a user can only update their own profile.
    *   Added `email` to the storage to ensure consistency.

## 3. Remaining Risks / Scope for Exploitation

### A. Account Cycling (Sybil Attack)
*   **Risk:** A user can create multiple accounts (different emails) to reuse "First Time" or "One Time" coupons.
*   **Mitigation:** This is a common SaaS issue. Mitigation requires phone number verification (OTP) or credit card fingerprinting (handled by Razorpay).
*   **Current Status:** Outside current scope, but `phone number` is collected. We could enforce unique phone numbers in the future.

### B. Webhook Reliability
*   **Risk:** If the Razorpay webhook fails or is delayed, the local DB might not reflect the `active` status immediately.
*   **Mitigation:** The webhook handler is idempotent (uses `upsert`).
*   **Recommendation:** Monitor webhook logs in Supabase/Razorpay dashboard.

### C. Founder Plan "Forever" Validity
*   **Risk:** The "Founder" plan is technically a different Razorpay Plan ID. If the logic to "end after 1 year" relies solely on the subscription expiring, it is safe.
*   **Check:** We set `total_count` to 12 (monthly) or 1 (yearly) for Founder plans. This ensures it auto-expires after 1 year, forcing re-registration. This logic is implemented in `razorpayActions.js`.

## 4. Conclusion
The current implementation addresses the primary concerns regarding coupon abuse and payment security. The system is robust against standard manipulation attempts.
