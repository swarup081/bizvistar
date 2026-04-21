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

    // Use Vercel's DNS assignment domain for www.bizvistar.in
    // This ensures we always reach the correct Vercel deployment
    const vercelOrigin = 'https://df0160f7b929ab62.vercel-dns-017.com';

    // Build headers — pass subdomain info
    const headers = new Headers(request.headers);
    // Set Host to bizvistar.in so Vercel serves the correct project
    headers.set('Host', 'www.bizvistar.in');
    headers.set('X-Subdomain', subdomain);
    headers.set('X-Original-Host', hostname);
    headers.set('X-Forwarded-Host', hostname);

    // Proxy ALL requests to Vercel with the SAME path
    // Next.js middleware will handle rewriting /path → /site/slug/path internally
    const targetUrl = `${vercelOrigin}${pathname}${url.search}`;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual', // Don't follow redirects automatically
    });

    // If Vercel redirects www → root, ignore and return the response body
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        // Follow the redirect but keep our custom headers
        const redirectUrl = new URL(location, targetUrl);
        // Replace the host with vercel origin
        redirectUrl.hostname = 'df0160f7b929ab62.vercel-dns-017.com';
        
        const redirectResponse = await fetch(redirectUrl.toString(), {
          method: request.method,
          headers,
          body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        });
        return new Response(redirectResponse.body, redirectResponse);
      }
    }

    return new Response(response.body, response);
  }
};
