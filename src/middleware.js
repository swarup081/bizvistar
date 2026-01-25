import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
     console.error('[Middleware] Missing Supabase Environment Variables');
     // Allow request to proceed (or fail downstream) to avoid infinite redirects on misconfiguration
     return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    // Append the current path as a 'redirect' param so the user can return
    signInUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(signInUrl)
  }

  // Security Fix: Restrict /dashboard access to users with a live shop
  if (path.startsWith('/dashboard') && user) {
    const { data: website } = await supabase
      .from('websites')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (!website) {
      // Redirect to templates page to create a shop
      return NextResponse.redirect(new URL('/templates', request.url));
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
  ],
}
