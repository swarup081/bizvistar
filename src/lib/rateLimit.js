import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new Redis client (it automatically picks up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env)
let redis;
try {
  redis = Redis.fromEnv();
} catch (e) {
  console.warn('[RateLimit] Upstash Redis credentials missing. Rate limiting will be bypassed.');
}

// 1. AI Rate Limiter: Stricter, 5 requests per 1 minute (to save OpenAI costs)
export const aiRateLimiter = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit/ai',
    })
  : null;

// 2. Upload Rate Limiter: 10 requests per 1 minute
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

  // Identify the user by IP address
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             '127.0.0.1';
             
  const limiter = type === 'ai' ? aiRateLimiter : uploadRateLimiter;
  
  if (!limiter) return { success: true };

  const { success, limit, reset, remaining } = await limiter.limit(ip);
  return { success, limit, reset, remaining };
}
