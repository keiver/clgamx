import CacheManager from "./CacheManager"

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.Mock

describe("class CacheManager", () => {
  let cacheManager: CacheManager

  beforeEach(() => {
    cacheManager = new CacheManager()
    mockFetch.mockReset()
  })

  describe("get and set operations", () => {
    it("should return null for non-existent key", () => {
      expect(cacheManager.get("nonexistent")).toBeNull()
    })

    it("should store and retrieve values correctly", () => {
      const testData = {
        test: "data"
      }

      cacheManager.set("testKey", testData)
      expect(cacheManager.get("testKey")).toEqual(testData)
    })

    it("should overwrite existing values", () => {
      cacheManager.set("testKey", "oldValue")
      cacheManager.set("testKey", "newValue")
      expect(cacheManager.get("testKey")).toBe("newValue")
    })
  })

  describe("fetch operations", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should fetch and cache data", async () => {
      const testData = {
        test: "data"
      }

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(testData)
      })

      const result = await cacheManager.fetch("https://api.test.com/data")

      expect(result).toEqual(testData)
      expect(cacheManager.get("https://api.test.com/data")).toEqual(testData)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it("should reuse in flight requests", async () => {
      const testData = {
        test: "data"
      }

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(testData)
      })

      const promise1 = cacheManager.fetch("https://api.test.com/data")
      const promise2 = cacheManager.fetch("https://api.test.com/data")

      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toEqual(testData)
      expect(result2).toEqual(testData)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it("should handle fetch errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      await expect(cacheManager.fetch("https://api.test.com/data")).rejects.toThrow("Network error")
      expect(cacheManager.get("https://api.test.com/data")).toBeNull()
    })
  })

  describe("serialization", () => {
    it("should correctly serialize and deserialize cache contents", () => {
      const testData1 = {test: "data1"}
      const testData2 = {test: "data2"}

      cacheManager.set("key1", testData1)
      cacheManager.set("key2", testData2)

      const serialized = cacheManager.serialize()
      const deserialized = CacheManager.deserialize(serialized)

      expect(deserialized.get("key1")).toEqual(testData1)
      expect(deserialized.get("key2")).toEqual(testData2)
    })

    it("should handle empty cache serialization", () => {
      const serialized = cacheManager.serialize()
      const deserialized = CacheManager.deserialize(serialized)

      expect(deserialized.get("anyKey")).toBeNull()
    })
  })

  describe("clear operation", () => {
    it("should clear all cached data", () => {
      cacheManager.set("key1", "value1")
      cacheManager.set("key2", "value2")
      cacheManager.clear()
      expect(cacheManager.get("key1")).toBeNull()
      expect(cacheManager.get("key2")).toBeNull()
    })

    it("should clear in-flight requests", async () => {
      const testData = {
        test: "data"
      }

      mockFetch.mockResolvedValueOnce({
        json: () => new Promise(resolve => setTimeout(() => resolve(testData), 100))
      })

      const fetchPromise = cacheManager.fetch("https://api.test.com/data")

      cacheManager.clear()
      await fetchPromise

      expect(cacheManager.get("https://api.test.com/data")).toBeNull()
    })
  })

  xit("should cleanup memory when limit hit", () => {
    //TODO: add logic to cleanup memory when at a limit
  })
})
