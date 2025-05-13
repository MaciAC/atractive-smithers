interface CachedUrl {
  url: string;
  expiresAt: number;
}

class UrlCache {
  private cache: Map<string, CachedUrl> = new Map();
  private static instance: UrlCache;

  private constructor() {}

  static getInstance(): UrlCache {
    if (!UrlCache.instance) {
      UrlCache.instance = new UrlCache();
    }
    return UrlCache.instance;
  }

  set(key: string, url: string): void {
    // Set expiration to 24 hours from now
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    this.cache.set(key, { url, expiresAt });
  }

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if the URL has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.url;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const urlCache = UrlCache.getInstance();