/**
 * Rate Limiting Utilities
 * 
 * Protects APIs from abuse by limiting requests per IP/user
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Check if request is allowed
   */
  check(
    identifier: string,
    limit: number = 100,
    windowSeconds: number = 60
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // No entry or expired - create new
    if (!entry || now > entry.resetAt) {
      const resetAt = now + (windowSeconds * 1000);
      this.store.set(identifier, { count: 1, resetAt });
      
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt
      };
    }

    // Check if limit exceeded
    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt
      };
    }

    // Increment count
    entry.count++;
    this.store.set(identifier, entry);

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetAt: entry.resetAt
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.store.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[RateLimit] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Get stats
   */
  stats(): { totalEntries: number } {
    return {
      totalEntries: this.store.size
    };
  }

  /**
   * Destroy rate limiter
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Rate limit middleware
 */
export function rateLimit(
  request: Request,
  options: {
    limit?: number;
    windowSeconds?: number;
    identifier?: string;
  } = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const {
    limit = 100,
    windowSeconds = 60,
    identifier = getClientIdentifier(request)
  } = options;

  return rateLimiter.check(identifier, limit, windowSeconds);
}

/**
 * Rate limit configs for different endpoints
 */
export const RateLimitConfigs = {
  // Strict limits for auth endpoints
  auth: {
    login: { limit: 5, windowSeconds: 60 * 5 }, // 5 attempts per 5 minutes
    register: { limit: 3, windowSeconds: 60 * 60 }, // 3 per hour
    forgotPassword: { limit: 3, windowSeconds: 60 * 60 }, // 3 per hour
    resetPassword: { limit: 5, windowSeconds: 60 * 60 }, // 5 per hour
  },
  
  // Moderate limits for API endpoints
  api: {
    read: { limit: 100, windowSeconds: 60 }, // 100 per minute
    write: { limit: 30, windowSeconds: 60 }, // 30 per minute
    upload: { limit: 10, windowSeconds: 60 }, // 10 per minute
  },
  
  // Relaxed limits for public endpoints
  public: {
    blog: { limit: 200, windowSeconds: 60 }, // 200 per minute
    contact: { limit: 5, windowSeconds: 60 * 60 }, // 5 per hour
  }
};

/**
 * Create rate limit response
 */
export function createRateLimitResponse(resetAt: number) {
  const resetInSeconds = Math.ceil((resetAt - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${resetInSeconds} seconds.`,
      retryAfter: resetInSeconds
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': resetInSeconds.toString(),
        'X-RateLimit-Reset': new Date(resetAt).toISOString()
      }
    }
  );
}

export default rateLimiter;
