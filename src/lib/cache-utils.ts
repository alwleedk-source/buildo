/**
 * Caching Utilities
 * 
 * Provides in-memory caching with TTL support
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Set a cache entry with TTL
   */
  set<T>(key: string, value: T, ttlSeconds: number = 3600): void {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get a cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.store.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Destroy cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Global cache instance
const cache = new Cache();

/**
 * Get or set cached value
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = cache.get<T>(key);
  
  if (cached !== null) {
    console.log(`[Cache] HIT: ${key}`);
    return cached;
  }

  console.log(`[Cache] MISS: ${key}`);
  
  // Fetch fresh data
  const value = await fetcher();
  
  // Store in cache
  cache.set(key, value, ttlSeconds);
  
  return value;
}

/**
 * Invalidate cache by key or pattern
 */
export function invalidateCache(keyOrPattern: string): void {
  if (keyOrPattern.includes('*')) {
    // Pattern matching
    const pattern = new RegExp(keyOrPattern.replace(/\*/g, '.*'));
    const stats = cache.stats();
    
    stats.keys.forEach(key => {
      if (pattern.test(key)) {
        cache.delete(key);
      }
    });
  } else {
    // Exact key
    cache.delete(keyOrPattern);
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return cache.stats();
}

// Cache key generators
export const CacheKeys = {
  blog: {
    list: (page: number, limit: number) => `blog:list:${page}:${limit}`,
    article: (slug: string) => `blog:article:${slug}`,
    category: (category: string) => `blog:category:${category}`,
    tag: (tag: string) => `blog:tag:${tag}`,
  },
  services: {
    list: () => 'services:list',
    detail: (id: string) => `services:detail:${id}`,
  },
  projects: {
    list: () => 'projects:list',
    detail: (id: string) => `projects:detail:${id}`,
  },
  settings: {
    theme: () => 'settings:theme',
    general: () => 'settings:general',
    company: () => 'settings:company',
  }
};

export default cache;
