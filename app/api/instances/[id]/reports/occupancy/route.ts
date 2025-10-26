import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subDays, eachDayOfInterval, format } from "date-fns"

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
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() })

    const rooms = await prisma.room.findMany({
      where: { instanceId: id },
    })

    const reservations = await prisma.reservation.findMany({
      where: {
        instanceId: id,
        status: {
          in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"],
        },
      },
    })

    const occupancyData = days.map((day) => {
      const occupiedRooms = reservations.filter((reservation) => {
        const checkIn = new Date(reservation.checkIn)
        const checkOut = new Date(reservation.checkOut)
        return day >= checkIn && day <= checkOut
      }).length

      return {
        date: format(day, "yyyy-MM-dd"),
        totalRooms: rooms.length,
        occupiedRooms,
        occupancyRate: rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0,
      }
    })

    return NextResponse.json(occupancyData)
  } catch (error) {
    console.error("Failed to fetch occupancy data:", error)
    return NextResponse.json({ error: "Failed to fetch occupancy data" }, { status: 500 })
  }
}
