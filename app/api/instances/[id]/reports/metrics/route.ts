import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subDays } from "date-fns"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const instance = await prisma.instance.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    const thirtyDaysAgo = subDays(new Date(), 30)

    // Get total revenue
    const reservations = await prisma.reservation.findMany({
      where: {
        instanceId: id,
        checkIn: {
          gte: thirtyDaysAgo,
        },
        status: {
          in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"],
        },
      },
    })

    const totalRevenue = reservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0)

    // Get total reservations
    const totalReservations = reservations.length

    // Calculate occupancy rate
    const rooms = await prisma.room.findMany({
      where: { instanceId: id },
    })

    const totalRoomNights = rooms.length * 30
    const occupiedNights = reservations.reduce((sum, reservation) => {
      const nights = Math.ceil(
        (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24),
      )
      return sum + nights
    }, 0)

    const occupancyRate = totalRoomNights > 0 ? (occupiedNights / totalRoomNights) * 100 : 0

    // Calculate average daily rate
    const averageDailyRate = occupiedNights > 0 ? totalRevenue / occupiedNights : 0

    return NextResponse.json({
      totalRevenue,
      totalReservations,
      occupancyRate,
      averageDailyRate,
    })
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
