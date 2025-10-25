import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "up",
        api: "up",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "down",
          api: "up",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
