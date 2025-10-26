import { z } from "zod"

const envSchema = z.object({
  // Database
  NEON_NEON_DATABASE_URL: z.string().min(1, "Database URL is required"),

  // NextAuth
  NEXTAUTH_URL: z.string().min(1, "NextAuth URL is required"),
  NEXTAUTH_SECRET: z.string().min(32, "NextAuth secret must be at least 32 characters"),

  // Upstash Redis (for rate limiting) - optional
  UPSTASH_KV_REST_API_URL: z.string().optional(),
  UPSTASH_KV_REST_API_TOKEN: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables
const parsedEnv = envSchema.safeParse({
  NEON_NEON_DATABASE_URL: process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  UPSTASH_KV_REST_API_URL: process.env.UPSTASH_KV_REST_API_URL,
  UPSTASH_KV_REST_API_TOKEN: process.env.UPSTASH_KV_REST_API_TOKEN,
  NODE_ENV: process.env.NODE_ENV,
})

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:")
  console.error(parsedEnv.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

export const env: Env = parsedEnv.data
