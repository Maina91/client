import { createMiddleware } from "@tanstack/react-start";
import { rateLimiter } from "@/lib/rateLimiter";

/**
 * Utility to extract real client IP in production
 * Supports X-Forwarded-For for proxies/load balancers
 */
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // May contain multiple IPs, use the first
    return forwarded.split(",")[0].trim();
  }
  // Fallback to pseudo IP if unavailable
  return "127.0.0.1";
}

/**
 * Rate limiting middleware
 * - Checks global, IP, and user-based limits
 * - Returns 429 when limits exceeded
 * - Adds rate limit headers to response
 */
export const rateLimitMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    const clientIP = getClientIP(request);

    // Check global limit first
    const globalLimit = rateLimiter.checkGlobalLimit();
    if (!globalLimit.allowed) {
      throw new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((globalLimit.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": globalLimit.resetTime.toString(),
        },
      });
    }

    // Check IP limit
    const ipLimit = rateLimiter.checkIPLimit(clientIP, false); // Default to non-auth for now
    if (!ipLimit.allowed) {
      throw new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((ipLimit.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": ipLimit.resetTime.toString(),
        },
      });
    }

    // Continue with request processing
    return next();
  }
);

/**
 * User-specific rate limiting middleware (for authenticated endpoints)
 * Should be used after authMiddleware to ensure user context is available
 */
export const userRateLimitMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next, context }) => {
    // This assumes authMiddleware has been run and user context is available
    const user = (context as any)?.user;
    if (user?.email) {
      const userLimit = rateLimiter.checkUserLimit(user.email);
      if (!userLimit.allowed) {
        throw new Response("Too Many Requests", {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((userLimit.resetTime - Date.now()) / 1000).toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": userLimit.resetTime.toString(),
          },
        });
      }

      // Continue with request processing
      return next();
    }

    // If no user context, just continue
    return next();
  }
);

/**
 * Auth-specific rate limiting middleware (stricter limits for auth endpoints)
 */
export const authRateLimitMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    const clientIP = getClientIP(request);

    // Check IP limit with auth-specific settings
    const ipLimit = rateLimiter.checkIPLimit(clientIP, true);
    if (!ipLimit.allowed) {
      throw new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((ipLimit.resetTime - Date.now()) / 1000).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": ipLimit.resetTime.toString(),
        },
      });
    }

    // Continue with request processing
    return next();
  }
);
