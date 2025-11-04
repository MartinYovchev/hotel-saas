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

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type") || "occupancy"

    const thirtyDaysAgo = subDays(new Date(), 30)
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() })

    let csvContent = ""

    if (reportType === "occupancy") {
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

      csvContent = "Date,Total Rooms,Occupied Rooms,Occupancy Rate\n"

      days.forEach((day) => {
        const occupiedRooms = reservations.filter((reservation) => {
          const checkIn = new Date(reservation.checkIn)
          const checkOut = new Date(reservation.checkOut)
          return day >= checkIn && day <= checkOut
        }).length

        const occupancyRate = rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0

        csvContent += `${format(day, "yyyy-MM-dd")},${rooms.length},${occupiedRooms},${occupancyRate.toFixed(1)}%\n`
      })
    } else if (reportType === "revenue") {
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

      csvContent = "Date,Room Revenue,Service Revenue,Total Revenue\n"

      days.forEach((day) => {
        const dayReservations = reservations.filter((reservation) => {
          const checkIn = new Date(reservation.checkIn)
          return (
            checkIn.getDate() === day.getDate() &&
            checkIn.getMonth() === day.getMonth() &&
            checkIn.getFullYear() === day.getFullYear()
          )
        })

        const roomRevenue = dayReservations.reduce((sum, reservation) => sum + Number(reservation.totalPrice), 0)

        const serviceRevenue = dayReservations.reduce((sum, reservation) => {
          const servicesTotal = reservation.services.reduce(
            (serviceSum, rs) => serviceSum + Number(rs.service.price) * rs.quantity,
            0,
          )
          return sum + servicesTotal
        }, 0)

        const totalRevenue = Number(roomRevenue) + Number(serviceRevenue)

        csvContent += `${format(day, "yyyy-MM-dd")},${roomRevenue.toFixed(2)},${serviceRevenue.toFixed(2)},${totalRevenue.toFixed(2)}\n`
      })
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    })
  } catch (error) {
    console.error("Failed to export report:", error)
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 })
  }
}
