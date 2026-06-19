import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ─── SUBDOMAIN ROUTING ───
  // If the request comes from a Cloudflare Worker with a subdomain,
  // internally rewrite the URL to /site/[slug]/... so Next.js routes correctly.
  // The browser URL stays clean (e.g., abc.bizvistar.in/shop).
  const subdomain = request.headers.get('x-subdomain');
  if (subdomain) {
    const pathname = request.nextUrl.pathname;

    // Don't rewrite static assets or API routes
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/_vercel/') ||
      pathname.startsWith('/api/') ||
      pathname === '/favicon.ico'
    ) {
      return response;
    }

    // If the URL accidentally contains /templates/templateName/... on a subdomain, redirect to the clean URL
    if (pathname.startsWith('/templates/')) {
      const parts = pathname.split('/');
      let cleanPathname = '/';
      if (parts.length >= 4) {
          cleanPathname = '/' + parts.slice(3).join('/');
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = cleanPathname;
      return NextResponse.redirect(redirectUrl);
    }

    // Rewrite: / → /site/slug, /shop → /site/slug/shop, etc.
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/site/${subdomain}${pathname === '/' ? '' : pathname}`;

    // Pass subdomain info as a cookie so client-side code can detect it
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);
    rewriteResponse.cookies.set('x-subdomain', subdomain, {
      path: '/',
      httpOnly: false, // Readable by client-side JS
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    return rewriteResponse;
  }
  // ─── END SUBDOMAIN ROUTING ───

  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
     console.error('[Middleware] Missing Supabase Environment Variables');
     return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  if ((path.startsWith('/dashboard') || path.startsWith('/editor')) && !user) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(signInUrl)
  }

  // Dashboard access control
  if (user && path.startsWith('/dashboard')) {
    const { data: websites } = await supabase
      .from('websites')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (!websites || websites.length === 0) {
      // No website at all — redirect to templates to create one
      return NextResponse.redirect(new URL('/templates', request.url));
    }

    // Users with websites (published or draft) can access the full dashboard.
    // Publish enforcement happens at the publish action level, not here.
  }

  return response
}

export const config = {
  matcher: [
    // Match subdomain requests (any path that isn't a static file)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
