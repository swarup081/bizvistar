import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/:path*',
        destination: '/blogs/:path*',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
    ];
  },
  serverActions: {
    bodySizeLimit: '5mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kkxosbweiankzplxwxsk.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Removed X-Frame-Options: DENY to allow editor iframes
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache immutable build assets aggressively (content-hashed, safe to cache forever)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache public static files (favicon, manifest, icons, fonts) for 1 day
      {
        source: '/:path*.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|mp4)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

};

const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Disabled widenClientFileUpload to reduce build time
  widenClientFileUpload: false,

  // IE11 is EOL since June 2022 — no need to transpile for it
  transpileClientSDK: false,

  // Disabled to save Vercel function CPU on Hobby plan.
  // Sentry still works via direct client-side reporting.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  automaticVercelMonitors: true,
};

// Export plain Next.js config in dev to save massive amounts of RAM.
// Only apply Sentry Webpack plugin in production builds.
export default process.env.NODE_ENV === 'development' 
  ? nextConfig 
  : withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions);
