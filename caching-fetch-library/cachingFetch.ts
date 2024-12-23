import {useState, useEffect} from "react"

import CacheManager from "./CacheManager"

type UseCachingFetch = (url: string) => {
  isLoading: boolean
  data: unknown
  error: Error | null
}

// implied singleton instance for CacheManager
const globalCache = new CacheManager()

export const useCachingFetch: UseCachingFetch = url => {
  // pick up cached data for this url, using as initial state if in cache
  const cachedData = globalCache.get(url)

  const [state, setState] = useState<{
    isLoading: boolean
    data: unknown
    error: Error | null
  }>({
    isLoading: !cachedData,
    data: cachedData,
    error: null
  })

  useEffect(() => {
    // already have data, do not fetch again
    if (cachedData) return

    let mounted = true

    globalCache
      .fetch(url)
      .then(data => {
        if (mounted) {
          setState({
            data,
            isLoading: false,
            error: null
          })
        }
      })
      .catch(error => {
        if (mounted) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error(String(error))
          })
        }
      })

    return () => {
      mounted = false
    }
  }, [url, cachedData])

  // return cached data right away
  if (cachedData) {
    return {
      isLoading: false,
      data: cachedData,
      error: null
    }
  }

  return state
}

export const preloadCachingFetch = async (url: string): Promise<void> => {
  try {
    const data = await fetch(url).then(r => r.json())

    globalCache.set(url, data)
  } catch (error) {
    console.error("Error preloading cache:", error)

    throw error instanceof Error ? error : new Error(String(error))
  }
}

export const serializeCache = (): string => {
  return globalCache.serialize()
}

export const initializeCache = (serializedCache: string): void => {
  const newCache = CacheManager.deserialize(serializedCache)

  Object.assign(globalCache, newCache)
}

export const wipeCache = (): void => {
  globalCache.clear()
}
