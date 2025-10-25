import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const updateReservationSchema = z.object({
  guestName: z.string().min(1, "Guest name is required").optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).optional(),
  adults: z.number().min(1, "At least 1 adult is required").optional(),
  children: z.number().min(0).optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string; reservationId: string } }) {
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
    const data = updateReservationSchema.parse(body)

    const reservation = await prisma.reservation.update({
      where: {
        id: params.reservationId,
        instanceId: params.id,
      },
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        status: data.status,
        adults: data.adults,
        children: data.children,
      },
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
      },
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update reservation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
