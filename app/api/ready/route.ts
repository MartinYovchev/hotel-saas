import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check if database is ready and migrations are applied
    await prisma.$queryRaw`SELECT 1`

    // Check if at least one table exists (migrations applied)
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' LIMIT 1
    `

    if (!Array.isArray(tables) || tables.length === 0) {
      throw new Error("Database not initialized")
    }

    return NextResponse.json({
      status: "ready",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "not ready",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
