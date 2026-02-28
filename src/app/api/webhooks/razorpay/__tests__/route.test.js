import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Setup Mocks
vi.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'internal_plan_1' } }),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'web_1', website_data: {} } }),
      limit: vi.fn().mockReturnThis(),
      update: vi.fn().mockResolvedValue({ error: null }),
    })),
  };
  return {
    createClient: vi.fn(() => mockSupabase),
  };
});

// Mock Next.js Server
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status || 200 })),
  },
}));

describe('Razorpay Webhook', () => {
    let supabase;

    beforeEach(() => {
        vi.clearAllMocks();
        supabase = createClient();
        // Setup Secret
        process.env.RAZORPAY_WEBHOOK_SECRET = 'secret123';
    });

    it('should process subscription.charged event successfully', async () => {
        const payload = {
            event: 'subscription.charged',
            payload: {
                subscription: {
                    entity: {
                        id: 'sub_123',
                        plan_id: 'plan_123',
                        current_start: 1700000000,
                        current_end: 1700000000 + 86400,
                        notes: {
                            user_id: 'user_123'
                        }
                    }
                }
            }
        };
        const body = JSON.stringify(payload);
        const signature = crypto.createHmac('sha256', 'secret123').update(body).digest('hex');

        // Mock NextRequest
        const req = {
            text: vi.fn().mockResolvedValue(body),
            headers: {
                get: vi.fn().mockReturnValue(signature)
            }
        };

        const res = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({ status: 'ok' });
        expect(supabase.from).toHaveBeenCalledWith('subscriptions');
        // Expect website publishing logic to trigger
        expect(supabase.from).toHaveBeenCalledWith('websites');
    });

    it('should reject invalid signature', async () => {
        // Mock NextRequest
        const req = {
            text: vi.fn().mockResolvedValue('{}'),
            headers: {
                get: vi.fn().mockReturnValue('invalid_signature')
            }
        };

        const res = await POST(req);

        expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Invalid Signature' }, { status: 400 });
    });
});
