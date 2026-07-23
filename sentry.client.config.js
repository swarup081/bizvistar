import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information in the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Lazy-load replay integration to avoid ~40KB in initial bundle
  // Error reporting works immediately — only replay is deferred
  integrations: [],
});

// Lazy-load replay after page load to keep initial bundle lean
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      import('@sentry/nextjs').then((SentryModule) => {
        const client = SentryModule.getClient();
        if (client) {
          client.addIntegration(SentryModule.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }));
        }
      });
    }, 3000); // Defer 3s after page load
  });
}