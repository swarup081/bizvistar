import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitOrder, updateOrderStatus } from '../orderActions';
import { createClient } from '@supabase/supabase-js';

// Setup Mocks
vi.mock('@supabase/supabase-js', () => {
    // We create a mock that returns an object where `from` returns a proxy.
    // This proxy allows ANY method call to return the proxy itself,
    // EXCPET for terminal methods (single, maybeSingle, insert, update) which return defined objects.

    const terminalMethods = {
        single: vi.fn(),
        maybeSingle: vi.fn(),
        insert: vi.fn(),
        update: vi.fn()
    };

    const chainProxy = new Proxy(terminalMethods, {
        get(target, prop) {
            if (prop in target) return target[prop];
            // If it's a chaining method (eq, select, limit, etc.), return a function that returns the proxy
            return vi.fn().mockReturnValue(chainProxy);
        }
    });

    const mockSupabase = {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'owner_123' } } }),
        },
        from: vi.fn().mockReturnValue(chainProxy)
    };

    return {
        createClient: vi.fn(() => mockSupabase),
    };
});

// Mock notificationUtils
vi.mock('@/lib/notificationUtils', () => ({
    createNotification: vi.fn()
}));

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
             getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'owner_123' } } })
        }
    })),
}));

describe('orderActions', () => {
    let supabase;

    beforeEach(() => {
        vi.clearAllMocks();
        supabase = createClient();
    });

    describe('submitOrder', () => {
        it('should submit an order successfully', async () => {
            // Because our global mock returns a single Proxy, we need to mock the terminal methods
            // to return different data sequentially or based on logic if possible.
            // A simpler way is to just use mockResolvedValueOnce for the expected order of calls.

            // Order of terminal calls in submitOrder:
            // 1. websites.single()
            // 2. customers.maybeSingle()
            // 3. products.maybeSingle() (or multiple times if in a loop)
            // 4. orders.single()
            // 5. order_items.insert()

            // We need to access the mocked terminal methods.
            // Since we mocked them in the vi.mock factory, we can't directly reference them here easily unless we export them.
            // Let's redefine the createClient behavior for this specific test.

             const singleMock = vi.fn()
                 .mockResolvedValueOnce({ data: { id: 'web_123', user_id: 'owner_123' } }) // websites
                 .mockResolvedValueOnce({ data: { id: 'order_123' } }); // orders

             const maybeSingleMock = vi.fn()
                 .mockResolvedValueOnce({ data: { id: 'cust_123' } }) // customers
                 .mockResolvedValueOnce({ data: { id: 'prod_1', price: 100, stock: 10 } }); // products

             const insertMock = vi.fn().mockResolvedValue({ error: null, data: {id: 'some_id'} });
             const updateMock = vi.fn().mockResolvedValue({ error: null });

             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 limit: vi.fn().mockReturnThis(),
                 single: singleMock,
                 maybeSingle: maybeSingleMock,
                 insert: insertMock,
                 update: updateMock
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'owner_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

            const orderData = {
                siteSlug: 'test-site',
                cartDetails: [{ id: 'prod_1', quantity: 2, name: 'Test Product' }],
                customerDetails: {
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    address: '123 Test St'
                }
            };

            const result = await submitOrder(orderData);

            expect(result.success).toBe(true);
            expect(result.orderId).toBe('order_123');
        });

        it('should fail if product is not found', async () => {
             const singleMock = vi.fn()
                 .mockResolvedValueOnce({ data: { id: 'web_123', user_id: 'owner_123' } }); // websites

             const maybeSingleMock = vi.fn()
                 .mockResolvedValueOnce({ data: { id: 'cust_123' } }) // customers
                 .mockResolvedValueOnce({ data: null }); // products (NOT FOUND)

             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 limit: vi.fn().mockReturnThis(),
                 single: singleMock,
                 maybeSingle: maybeSingleMock
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'owner_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

             const orderData = {
                siteSlug: 'test-site',
                cartDetails: [{ id: 'prod_missing', quantity: 1, name: 'Missing Product' }],
                customerDetails: { email: 't@e.com' }
            };

            const result = await submitOrder(orderData);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Product not found');
        });
    });

    describe('updateOrderStatus', () => {
        it('should update status if owner', async () => {
             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 single: vi.fn().mockResolvedValue({ data: { website_id: 'web_1', websites: { user_id: 'owner_123' } } }),
                 update: vi.fn().mockResolvedValue({ error: null })
             };

             vi.mocked(createClient).mockReturnValue({
                 auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'owner_123' } } }) },
                 from: vi.fn().mockReturnValue(chainMock)
             });

            const result = await updateOrderStatus('order_123', 'shipped');
            expect(result.success).toBe(true);
        });

        it('should fail if not owner', async () => {
             const chainMock = {
                 select: vi.fn().mockReturnThis(),
                 eq: vi.fn().mockReturnThis(),
                 single: vi.fn().mockResolvedValue({ data: { website_id: 'web_1', websites: { user_id: 'owner_123' } } }),
                 update: vi.fn().mockResolvedValue({ error: null })
             };

             // The code uses createServerClient for user, and createClient for admin operations.
             const ssr = await import('@supabase/ssr');
             ssr.createServerClient.mockReturnValue({
                  auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'hacker_123' } } }) }
             });

             vi.mocked(createClient).mockReturnValue({
                 from: vi.fn().mockReturnValue(chainMock)
             });

            await expect(updateOrderStatus('order_123', 'shipped')).rejects.toThrow('Unauthorized');
        });
    });
});
