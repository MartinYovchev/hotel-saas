import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  floor: z.number().nullable().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "CLEANING"]).default("AVAILABLE"),
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
    const data = createRoomSchema.parse(body)

    // Check if room number already exists
    const existingRoom = await prisma.room.findUnique({
      where: {
        instanceId_roomNumber: {
          instanceId: params.id,
          roomNumber: data.roomNumber,
        },
      },
    })

    if (existingRoom) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 })
    }

    const room = await prisma.room.create({
      data: {
        instanceId: params.id,
        roomNumber: data.roomNumber,
        roomTypeId: data.roomTypeId,
        floor: data.floor,
        status: data.status,
      },
      include: {
        roomType: true,
      },
    })

    return NextResponse.json({ room }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create room error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
