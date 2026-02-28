import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveBillingDetailsAction, validateCouponAction, createSubscriptionAction } from '../razorpayActions';
import { createClient } from '@supabase/supabase-js';

// Setup Mocks
vi.mock('@supabase/supabase-js', () => {
    const terminalMethods = {
        single: vi.fn(),
        maybeSingle: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        upsert: vi.fn()
    };

    const chainProxy = new Proxy(terminalMethods, {
        get(target, prop) {
            if (prop in target) return target[prop];
            return vi.fn().mockReturnValue(chainProxy);
        }
    });

    const mockSupabase = {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_123' } } }),
        },
        from: vi.fn().mockReturnValue(chainProxy)
    };

    return {
        createClient: vi.fn(() => mockSupabase),
    };
});

// Mock Next.js Headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
      get: vi.fn(),
  })),
}));

// Mock SSR
vi.mock('@supabase/ssr', () => ({
    createServerClient: vi.fn(() => ({
        auth: {
             getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_123' } } })
        }
    })),
}));

// Mock Config
vi.mock('../config/razorpay-config', () => ({
  default: {},
  getPlanId: vi.fn(() => 'plan_123'),
  getKeyId: vi.fn(() => 'key_123'),
  getRazorpayMode: vi.fn(() => 'test'),
  getStandardPlanId: vi.fn(() => 'standard_plan_123'),
  COUPON_CONFIG: {
    'TESTCOUPON': { active: true, percentOff: 10, type: 'discount' },
    'EXPIRED': { active: true, expiresAt: '2000-01-01' },
    'LIMIT': { active: true, limit: 1 },
  },
}));

describe('razorpayActions', () => {
    let supabase;

    beforeEach(() => {
        vi.clearAllMocks();
        supabase = createClient();
    });

    describe('saveBillingDetailsAction', () => {
        it('should save billing details successfully', async () => {
             const updateMock = vi.fn().mockResolvedValue({ error: null });
             const chainMock = {
                 update: updateMock,
                 eq: vi.fn().mockReturnThis()
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

            const billingData = {
                fullName: 'John Doe',
                address: '123 Main St',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                email: 'john@example.com'
            };

            const result = await saveBillingDetailsAction(billingData, 'fake_token');
            expect(result.success).toBe(true);
        });

        it('should fail if required fields are missing', async () => {
             const result = await saveBillingDetailsAction({}, 'fake_token');
             expect(result.success).toBe(false);
             expect(result.error).toContain('Missing required billing fields');
        });
    });

    describe('validateCouponAction', () => {
        it('should return valid for active coupon', async () => {
            const result = await validateCouponAction('TESTCOUPON');
            expect(result.valid).toBe(true);
            expect(result.percentOff).toBe(10);
        });

        it('should return invalid for non-existent coupon', async () => {
            const result = await validateCouponAction('INVALID');
            expect(result.valid).toBe(false);
        });

        it('should return invalid for expired coupon', async () => {
            const result = await validateCouponAction('EXPIRED');
            expect(result.valid).toBe(false);
            expect(result.message).toBe('Coupon Expired');
        });
    });

    describe('createSubscriptionAction', () => {
        it('should create a subscription successfully', async () => {
             const maybeSingleMock = vi.fn()
                .mockResolvedValueOnce({ data: null }) // subscriptions check

             const singleMock = vi.fn()
                .mockResolvedValueOnce({ data: { billing_address: { fullName: 'John' } } }); // profiles

             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 in: vi.fn().mockReturnThis(),
                 maybeSingle: maybeSingleMock,
                 single: singleMock
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

            const result = await createSubscriptionAction('Pro', 'monthly', '', 'fake_token');

            expect(result.success).toBe(true);
            expect(result.subscriptionId).toBe('sub_mock_123');
        });

        it('should fail if user already has an active subscription', async () => {
             const futureDate = new Date();
             futureDate.setDate(futureDate.getDate() + 30);

             const maybeSingleMock = vi.fn()
                .mockResolvedValueOnce({ data: { status: 'active', current_period_end: futureDate.toISOString() } })

             const singleMock = vi.fn()
                .mockResolvedValueOnce({ data: { billing_address: { fullName: 'John' } } });

             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 in: vi.fn().mockReturnThis(),
                 maybeSingle: maybeSingleMock,
                 single: singleMock
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

             const result = await createSubscriptionAction('Pro', 'monthly', '', 'fake_token');
             expect(result.success).toBe(false);
             expect(result.error).toContain('already have an active plan');
        });
    });
});
