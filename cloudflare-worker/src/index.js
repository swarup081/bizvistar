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

    // Proxy directly to the main www domain
    // Vercel routes traffic correctly when using the assigned project domain
    const vercelOrigin = 'https://www.bizvistar.in';

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
        redirectUrl.hostname = 'www.bizvistar.in';
        
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
