type CacheEntry = {
  data: unknown;
  timestamp: number;
  size: number;
};

export default class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Promise<unknown>>();
  private isCleared = false;

  // TODO: if time, implement cache size management and stale while revalidate
  // (checking timestamp and resolve if present, but fetch in background)
  // used too mych time on this class already
  private maxSize: number;
  private currentSize = 0;

  constructor(maxSizeMB = 50) {
    this.maxSize = maxSizeMB * 1024 * 1024;
  }

  get(key: string) {
    return this.cache.get(key)?.data || null;
  }

  set(key: string, value: unknown) {
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      size,
    });
  }

  async fetch(key: string): Promise<unknown> {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key)!;
    }

    const promise = fetch(key)
      .then((r) => r.json())
      .then((data) => {
        // only set the cache if clear() hasn't been called,
        // need this check to avoid setting the cache after a clear event
        if (!this.isCleared) {
          this.set(key, data);
        }

        // remove the in-flight promise
        this.inFlight.delete(key);

        return data;
      })
      .catch((error) => {
        this.inFlight.delete(key);

        throw error;
      });

    this.inFlight.set(key, promise);

    return promise;
  }

  serialize() {
    return JSON.stringify(Array.from(this.cache.entries()));
  }

  static deserialize(data: string) {
    const cache = new CacheManager();
    const entries = JSON.parse(data);

    entries.forEach(([key, entry]: [string, CacheEntry]) => {
      cache.cache.set(key, entry);
    });

    return cache;
  }

  clear() {
    this.isCleared = true;
    this.cache.clear();
    this.inFlight.clear();
  }
}
