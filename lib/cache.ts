import crypto from 'crypto';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.cache = new Map();
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate a hash from the request payload
   */
  private generateHash(payload: any): string {
    const jsonString = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(payload: any): T | null {
    const hash = this.generateHash(payload);
    const entry = this.cache.get(hash);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired
      this.cache.delete(hash);
      console.log(`🗑️  Cache expired for hash: ${hash.substring(0, 8)}...`);
      return null;
    }

    console.log(`✅ Cache HIT for hash: ${hash.substring(0, 8)}...`);
    return entry.data as T;
  }

  /**
   * Set cache data with TTL
   */
  set<T>(payload: any, data: T, ttl: number = 5 * 60 * 1000): void {
    const hash = this.generateHash(payload);
    this.cache.set(hash, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    console.log(`💾 Cache SET for hash: ${hash.substring(0, 8)}... (TTL: ${ttl / 1000}s)`);
  }

  /**
   * Execute a function with caching
   */
  async withCache<T>(
    payload: any,
    fn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(payload);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn();
    this.set(payload, result, ttl);
    return result;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;

    for (const [hash, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(hash);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      console.log(`🧹 Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️  Cache cleared');
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
    };
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Export singleton instance
export const memoryCache = new MemoryCache();

// Export class for testing
export { MemoryCache };
