import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from '../../middleware';
import { NextResponse } from 'next/server';

// Mock Dependencies
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({ cookies: { set: vi.fn() }, headers: {} })),
    redirect: vi.fn((url) => ({ status: 307, headers: { Location: url.toString() } })),
  },
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

describe('Middleware', () => {
  let createServerClientMock;
  let supabaseMock;

  beforeEach(async () => {
    vi.clearAllMocks();
    const ssr = await import('@supabase/ssr');
    createServerClientMock = ssr.createServerClient;

    supabaseMock = {
      auth: { getUser: vi.fn() },
      from: vi.fn(() => ({
         select: vi.fn().mockReturnThis(),
         eq: vi.fn().mockReturnThis(),
         order: vi.fn().mockReturnThis(),
         limit: vi.fn().mockReturnThis(),
         maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      })),
    };
    createServerClientMock.mockReturnValue(supabaseMock);

    // Setup Env
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
  });

  const createRequest = (pathname) => ({
    nextUrl: { pathname, clone: () => ({ pathname }) },
    url: `http://localhost${pathname}`,
    cookies: { getAll: vi.fn(() => []) },
    headers: { get: vi.fn() },
  });

  it('should allow public routes without auth', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = createRequest('/');

    await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated users from /dashboard', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = createRequest('/dashboard');

    await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/sign-in');
    expect(redirectUrl.searchParams.get('redirect')).toBe('/dashboard');
  });

  it('should redirect unauthenticated users from /editor', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const req = createRequest('/editor/123');

    await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/sign-in');
  });

  it('should allow authenticated users with published website to access /dashboard', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });

    // Create a new mock for this specific test
    const customSupabaseMock = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1' } } }) },
      from: vi.fn(() => ({
         select: vi.fn().mockReturnThis(),
         eq: vi.fn().mockReturnThis(),
         order: vi.fn().mockReturnThis(),
         limit: vi.fn().mockReturnThis(),
         maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'web_1' } }),
      })),
    };
    createServerClientMock.mockReturnValue(customSupabaseMock);

    const req = createRequest('/dashboard');
    await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should redirect authenticated users WITHOUT published website from /dashboard to /templates', async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });

    // Create a new mock for this specific test
    const customSupabaseMock = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user_1' } } }) },
      from: vi.fn(() => ({
         select: vi.fn().mockReturnThis(),
         eq: vi.fn().mockReturnThis(),
         order: vi.fn().mockReturnThis(),
         limit: vi.fn().mockReturnThis(),
         maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      })),
    };
    createServerClientMock.mockReturnValue(customSupabaseMock);

    const req = createRequest('/dashboard');
    await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = NextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe('/templates');
  });
});
