let PrismaClient: any
let prisma: any

try {
  // Try to import PrismaClient - will fail in v0 preview environment
  const prismaModule = require("@prisma/client")
  PrismaClient = prismaModule.PrismaClient

  // Singleton pattern for Prisma Client
  const globalForPrisma = globalThis as unknown as {
    prisma: any
  }

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
} catch (error) {
  console.log("[v0] Prisma not available in this environment (preview mode)")
  prisma = null
}

export { prisma }
export type { PrismaClient }
