import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval } from "date-fns"

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

    // Get current month range
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get all rooms with their types
    const rooms = await prisma.room.findMany({
      where: { instanceId: id },
      include: {
        roomType: true,
      },
      orderBy: [
        { roomType: { name: "asc" } },
        { roomNumber: "asc" },
      ],
    })

    // Get all reservations for the current month
    const reservations = await prisma.reservation.findMany({
      where: {
        instanceId: id,
        status: {
          in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"],
        },
        OR: [
          {
            checkIn: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          {
            checkOut: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
          {
            AND: [
              { checkIn: { lte: monthStart } },
              { checkOut: { gte: monthEnd } },
            ],
          },
        ],
      },
      include: {
        room: true,
      },
    })

    // Calculate availability for each room for each day
    const roomAvailability = rooms.map((room) => {
      const dailyAvailability = daysInMonth.map((day) => {
        // Check if room is available on this day
        const isOccupied = reservations.some((reservation) => {
          if (reservation.roomId !== room.id) return false

          const checkIn = new Date(reservation.checkIn)
          const checkOut = new Date(reservation.checkOut)

          return isWithinInterval(day, { start: checkIn, end: checkOut })
        })

        return {
          date: format(day, "yyyy-MM-dd"),
          available: !isOccupied && room.status === "AVAILABLE",
        }
      })

      const availableDays = dailyAvailability.filter((d) => d.available).length

      return {
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType.name,
        status: room.status,
        dailyAvailability,
        availableDays,
        occupancyRate: ((daysInMonth.length - availableDays) / daysInMonth.length) * 100,
      }
    })

    // Calculate overall statistics
    const totalRooms = rooms.length
    const totalPossibleRoomNights = totalRooms * daysInMonth.length
    const totalAvailableRoomNights = roomAvailability.reduce((sum, room) => sum + room.availableDays, 0)
    const totalOccupiedRoomNights = totalPossibleRoomNights - totalAvailableRoomNights
    const overallOccupancyRate = totalPossibleRoomNights > 0
      ? (totalOccupiedRoomNights / totalPossibleRoomNights) * 100
      : 0

    // Current availability (today)
    const today = format(now, "yyyy-MM-dd")
    const currentlyAvailable = roomAvailability.filter((room) => {
      const todayAvailability = room.dailyAvailability.find((d) => d.date === today)
      return todayAvailability?.available
    }).length

    // Availability by room type
    const roomTypes = Array.from(new Set(rooms.map((r) => r.roomType.name)))
    const availabilityByType = roomTypes.map((typeName) => {
      const typeRooms = roomAvailability.filter((r) => r.roomType === typeName)
      const typeAvailableNights = typeRooms.reduce((sum, r) => sum + r.availableDays, 0)
      const typeTotalNights = typeRooms.length * daysInMonth.length

      return {
        roomType: typeName,
        totalRooms: typeRooms.length,
        availableNights: typeAvailableNights,
        occupancyRate: typeTotalNights > 0 ? ((typeTotalNights - typeAvailableNights) / typeTotalNights) * 100 : 0,
      }
    })

    return NextResponse.json({
      month: format(monthStart, "MMMM yyyy"),
      daysInMonth: daysInMonth.map((d) => format(d, "yyyy-MM-dd")),
      statistics: {
        totalRooms,
        currentlyAvailable,
        totalAvailableRoomNights,
        totalOccupiedRoomNights,
        totalPossibleRoomNights,
        overallOccupancyRate,
      },
      roomAvailability,
      availabilityByType,
    })
  } catch (error) {
    console.error("Failed to fetch availability data:", error)
    return NextResponse.json({ error: "Failed to fetch availability data" }, { status: 500 })
  }
}
