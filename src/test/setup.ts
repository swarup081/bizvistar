import { vi } from 'vitest';
import '@testing-library/jest-dom';
import 'resize-observer-polyfill';

// Mock Supabase
const mockSupabase = {
    auth: {
        getUser: vi.fn(),
        getSession: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
    },
    from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
        order: vi.fn().mockReturnThis(),
    })),
};

vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabase),
}));

vi.mock('@supabase/ssr', () => ({
    createServerClient: vi.fn(() => mockSupabase),
    createBrowserClient: vi.fn(() => mockSupabase),
}));

// Mock Razorpay
vi.mock('razorpay', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            subscriptions: {
                create: vi.fn().mockResolvedValue({ id: 'sub_mock_123' }),
                fetch: vi.fn().mockResolvedValue({ status: 'active' }),
            },
            orders: {
                create: vi.fn().mockResolvedValue({ id: 'order_mock_123' }),
            },
        })),
    };
});

// Mock Next.js Headers/Cookies
vi.mock('next/headers', () => ({
    cookies: vi.fn(() => ({
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
        get: vi.fn(),
    })),
}));

// Mock Next.js Navigation
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    })),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    usePathname: vi.fn(() => '/'),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.RAZORPAY_LIVE_KEY_SECRET = 'mock-live-secret';
process.env.RAZORPAY_TEST_KEY_SECRET = 'mock-test-secret';
process.env.RAZORPAY_Live_Key_ID = 'mock-live-id';

// Global ResizeObserver mock (if polyfill doesn't catch all cases)
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Mock console.error to keep test output clean, or spy on it
// vi.spyOn(console, 'error').mockImplementation(() => {});
