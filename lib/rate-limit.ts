import { NextResponse } from "next/server"
import { logger } from "./logger"

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Try to use Upstash Redis if available
let redis: any = null
try {
  if (process.env["UPSTASH-KV_KV_REST_API_URL"] && process.env["UPSTASH-KV_KV_REST_API_TOKEN"]) {
    const { Redis } = require("@upstash/redis")
    redis = new Redis({
      url: process.env["UPSTASH-KV_KV_REST_API_URL"],
      token: process.env["UPSTASH-KV_KV_REST_API_TOKEN"],
    })
    logger.info("Rate limiting using Upstash Redis")
  } else {
    logger.info("Rate limiting using in-memory store (not recommended for production)")
  }
} catch (error) {
  logger.warn("Failed to initialize Redis, falling back to in-memory store", { error })
}

// Clean up old entries every 5 minutes (only for in-memory store)
if (!redis) {
  setInterval(
    () => {
      const now = Date.now()
      Object.keys(store).forEach((key) => {
        if (store[key].resetAt < now) {
          delete store[key]
        }
      })
    },
    5 * 60 * 1000,
  )
}

interface RateLimitOptions {
  interval: number // in milliseconds
  maxRequests: number
}

export function rateLimit(options: RateLimitOptions) {
  return async (request: Request, identifier: string) => {
    const key = `ratelimit:${identifier}:${new URL(request.url).pathname}`
    const now = Date.now()

    if (redis) {
      try {
        const count = await redis.incr(key)
        if (count === 1) {
          await redis.pexpire(key, options.interval)
        }

        if (count > options.maxRequests) {
          const ttl = await redis.pttl(key)
          const resetIn = Math.ceil(ttl / 1000)
          logger.warn("Rate limit exceeded", { identifier, url: request.url })

          return NextResponse.json(
            { error: `Too many requests. Try again in ${resetIn} seconds.` },
            {
              status: 429,
              headers: {
                "Retry-After": String(resetIn),
                "X-RateLimit-Limit": String(options.maxRequests),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": String(now + ttl),
              },
            },
          )
        }

        return null
      } catch (error) {
        logger.error("Redis rate limit error, falling back to in-memory", { error })
        // Fall through to in-memory implementation
      }
    }

    // In-memory fallback
    if (!store[key] || store[key].resetAt < now) {
      store[key] = {
        count: 1,
        resetAt: now + options.interval,
      }
      return null
    }

    store[key].count++

    if (store[key].count > options.maxRequests) {
      const resetIn = Math.ceil((store[key].resetAt - now) / 1000)
      logger.warn("Rate limit exceeded", { identifier, url: request.url })

      return NextResponse.json(
        { error: `Too many requests. Try again in ${resetIn} seconds.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetIn),
            "X-RateLimit-Limit": String(options.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(store[key].resetAt),
          },
        },
      )
    }

    return null
  }
}

// Preset rate limiters
export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
})

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
})
