export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const parts = hostname.split('.');
    const pathname = url.pathname;

    const isSubdomain = parts.length > 2;
    const subdomain = parts[0];

    const skipSubdomains = ['www', 'api', 'mail', 'send'];

    if (!isSubdomain || skipSubdomains.includes(subdomain)) {
      return fetch(request);
    }

    // Fetch directly from Vercel's edge (not via bizvistar.in DNS which might hit Cloudflare Pages)
    // Using cname.vercel-dns.com ensures we always reach Vercel's servers
    const vercelOrigin = 'https://cname.vercel-dns.com';

    // Build headers — pass subdomain info and correct Host
    const headers = new Headers(request.headers);
    headers.set('Host', 'bizvistar.in');
    headers.set('X-Subdomain', subdomain);
    headers.set('X-Original-Host', hostname);
    // Tell Vercel which domain this is for
    headers.set('X-Forwarded-Host', 'bizvistar.in');

    // Proxy ALL requests to Vercel with the SAME path
    // Next.js middleware will handle rewriting /path → /site/slug/path internally
    const targetUrl = `${vercelOrigin}${pathname}${url.search}`;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });

    // Return response as-is — no body rewriting needed
    return new Response(response.body, response);
  }
};
