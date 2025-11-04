import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify instance ownership
    const instance = await prisma.instance.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    // Delete completed/cancelled reservations that contribute to statistics
    // This clears historical data while keeping active reservations
    await prisma.reservation.deleteMany({
      where: {
        instanceId: id,
        status: {
          in: ["CHECKED_OUT", "CANCELLED"],
        },
      },
    })

    return NextResponse.json({ message: "All statistics have been cleared" })
  } catch (error) {
    console.error("Clear statistics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
