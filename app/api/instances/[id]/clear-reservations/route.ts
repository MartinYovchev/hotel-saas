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

    // Delete all reservations for this instance
    // Note: ReservationService entries will be deleted automatically due to CASCADE
    await prisma.reservation.deleteMany({
      where: {
        instanceId: id,
      },
    })

    return NextResponse.json({ message: "All reservations have been deleted" })
  } catch (error) {
    console.error("Clear reservations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
