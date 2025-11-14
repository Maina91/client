import {
  RATE_LIMIT_AUTH_MAX_REQUESTS,
  RATE_LIMIT_AUTH_WINDOW_MS,
  RATE_LIMIT_ENABLED,
  RATE_LIMIT_GLOBAL_MAX_REQUESTS,
  RATE_LIMIT_MAX_REQUESTS_PER_MINUTE,
  RATE_LIMIT_WINDOW_MS,
} from './config/envConfig';

// In-memory store for rate limiting (use Redis in production for multi-instance deployments)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private userStore = new Map<string, RateLimitEntry>();
  private ipStore = new Map<string, RateLimitEntry>();
  private globalStore = new Map<string, RateLimitEntry>();

  private cleanup() {
    const now = Date.now();
    // Clean up expired entries
    for (const [key, entry] of this.userStore.entries()) {
      if (entry.resetTime < now) {
        this.userStore.delete(key);
      }
    }
    for (const [key, entry] of this.ipStore.entries()) {
      if (entry.resetTime < now) {
        this.ipStore.delete(key);
      }
    }
    for (const [key, entry] of this.globalStore.entries()) {
      if (entry.resetTime < now) {
        this.globalStore.delete(key);
      }
    }
  }

  private checkLimit(
    store: Map<string, RateLimitEntry>,
    key: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    if (!RATE_LIMIT_ENABLED) {
      return { allowed: true, remaining: maxRequests, resetTime: 0 };
    }

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetTime < now) {
      // First request or window expired
      const resetTime = now + windowMs;
      store.set(key, { count: 1, resetTime });
      return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    store.set(key, entry);

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  checkUserLimit(userId: string): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    return this.checkLimit(
      this.userStore,
      `user:${userId}`,
      RATE_LIMIT_MAX_REQUESTS_PER_MINUTE,
      RATE_LIMIT_WINDOW_MS
    );
  }

  checkIPLimit(ip: string, isAuthEndpoint = false): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    const maxRequests = isAuthEndpoint ? RATE_LIMIT_AUTH_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS_PER_MINUTE;
    const windowMs = isAuthEndpoint ? RATE_LIMIT_AUTH_WINDOW_MS : RATE_LIMIT_WINDOW_MS;
    return this.checkLimit(
      this.ipStore,
      `ip:${ip}`,
      maxRequests,
      windowMs
    );
  }

  checkGlobalLimit(): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    return this.checkLimit(
      this.globalStore,
      'global',
      RATE_LIMIT_GLOBAL_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );
  }

  // Get current stats for monitoring
  getStats() {
    return {
      userEntries: this.userStore.size,
      ipEntries: this.ipStore.size,
      globalEntries: this.globalStore.size,
    };
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();
