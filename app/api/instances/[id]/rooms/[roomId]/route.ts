import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const updateRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  floor: z.number().nullable().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "CLEANING"]).optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string; roomId: string } }) {
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
    const data = updateRoomSchema.parse(body)

    const room = await prisma.room.update({
      where: {
        id: params.roomId,
        instanceId: params.id,
      },
      data: {
        roomNumber: data.roomNumber,
        floor: data.floor,
        status: data.status,
      },
      include: {
        roomType: true,
      },
    })

    return NextResponse.json({ room })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update room error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
