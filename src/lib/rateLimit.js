import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new Redis client (it automatically picks up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env)
let redis;
try {
  redis = Redis.fromEnv();
} catch (e) {
  console.warn('[RateLimit] Upstash Redis credentials missing. Rate limiting will be bypassed.');
}

// 1. AI Rate Limiter: 5 requests per 1 minute per IP (anti-bot protection)
export const aiRateLimiter = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/ai',
    })
  : null;

// 2. AI Global Daily Limiter: 900 requests per day across ALL users
// Groq free tier = 1000 RPD. We cap at 900 to leave a small buffer.
// Even if this limit is exceeded, Groq will just return 429 — no charges.
export const aiGlobalDailyLimiter = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(900, '1 d'),
      analytics: true,
      prefix: '@upstash/ratelimit/ai-global-daily',
    })
  : null;

// 3. Upload Rate Limiter: 10 requests per 1 minute
export const uploadRateLimiter = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/upload',
    })
  : null;

// Generic helper function to check limits
export async function checkRateLimit(req, type = 'api') {
  // If Redis isn't configured, bypass rate limiting
  if (!redis) return { success: true };

  try {
    // Identify the user by IP address
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               '127.0.0.1';
               
    const limiter = type === 'ai' ? aiRateLimiter : uploadRateLimiter;
    
    if (!limiter) return { success: true };

    const { success, limit, reset, remaining } = await limiter.limit(ip);
    
    // For AI requests, also check global daily limit
    if (type === 'ai' && success && aiGlobalDailyLimiter) {
      const globalDaily = await aiGlobalDailyLimiter.limit('global');
      if (!globalDaily.success) {
        return { success: false, limit: globalDaily.limit, reset: globalDaily.reset, remaining: 0 };
      }
    }

    return { success, limit, reset, remaining };
  } catch (err) {
    // If Redis is unreachable (DNS failure, network issues, etc.),
    // allow the request through. The in-memory daily limit in ai.js
    // still provides protection as a fallback.
    console.warn('[RateLimit] Redis connection failed, bypassing rate limit:', err.message);
    return { success: true };
  }
}
