import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subDays, eachDayOfInterval, format, isSameDay } from "date-fns"
import { serializePrismaData } from "@/lib/serialize"

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
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    })

    const revenueData = days.map((day) => {
      const dayReservations = reservations.filter((reservation) => isSameDay(new Date(reservation.checkIn), day))

      const roomRevenue = dayReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0)

      const serviceRevenue = dayReservations.reduce((sum, reservation) => {
        const servicesTotal = reservation.services.reduce(
          (serviceSum, rs) => serviceSum + rs.service.price * rs.quantity,
          0,
        )
        return sum + servicesTotal
      }, 0)

      return {
        date: format(day, "yyyy-MM-dd"),
        roomRevenue,
        serviceRevenue,
        totalRevenue: roomRevenue + serviceRevenue,
      }
    })

    return NextResponse.json(serializePrismaData(revenueData))
  } catch (error) {
    console.error("Failed to fetch revenue data:", error)
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 })
  }
}
