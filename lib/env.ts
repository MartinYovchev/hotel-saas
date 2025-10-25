import { z } from "zod"

const envSchema = z.object({
  // Database
  NEON_NEON_DATABASE_URL: z.string().optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // Upstash Redis (for rate limiting) - optional
  UPSTASH_KV_REST_API_URL: z.string().optional(),
  UPSTASH_KV_REST_API_TOKEN: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export type Env = z.infer<typeof envSchema>

export const env: Env = {
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXTAUTH_SECRET: process.env.NEATHAUTH_SECRET || "development-secret-change-in-production-min-32-chars",
  UPSTASH_KV_REST_API_URL: process.env["UPSTASH-KV_KV_REST_API_URL"],
  UPSTASH_KV_REST_API_TOKEN: process.env["UPSTASH-KV_KV_REST_API_TOKEN"],
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
}
