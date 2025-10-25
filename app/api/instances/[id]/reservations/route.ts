import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createReservationSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0).default(0),
  totalPrice: z.number().min(0, "Total price must be positive"),
  notes: z.string().optional(),
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify instance ownership
    const instance = await prisma.instance.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    const body = await request.json()
    const data = createReservationSchema.parse(body)

    // Verify room belongs to instance
    const room = await prisma.room.findFirst({
      where: {
        id: data.roomId,
        instanceId: params.id,
      },
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check for overlapping reservations
    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)

    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 })
    }

    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        roomId: data.roomId,
        status: {
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
        },
        OR: [
          {
            AND: [{ checkIn: { lte: checkInDate } }, { checkOut: { gt: checkInDate } }],
          },
          {
            AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gte: checkOutDate } }],
          },
          {
            AND: [{ checkIn: { gte: checkInDate } }, { checkOut: { lte: checkOutDate } }],
          },
        ],
      },
    })

    if (overlappingReservation) {
      return NextResponse.json({ error: "Room is not available for the selected dates" }, { status: 400 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        instanceId: params.id,
        roomId: data.roomId,
        guestName: data.guestName,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: data.adults,
        children: data.children,
        totalPrice: data.totalPrice,
        paidAmount: 0,
        notes: data.notes || null,
        status: "PENDING",
      },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
      },
    })

    return NextResponse.json({ reservation }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create reservation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
