import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { serializePrismaData } from "@/lib/serialize"

const updateRoomTypeSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  maxGuests: z.number().min(1, "Max guests must be at least 1").optional(),
  basePrice: z.number().min(0, "Base price must be positive").optional(),
  amenities: z.array(z.string()).optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; roomTypeId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, roomTypeId } = await params

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

    const body = await request.json()
    const data = updateRoomTypeSchema.parse(body)

    const roomType = await prisma.roomType.update({
      where: {
        id: roomTypeId,
        instanceId: id,
      },
      data: {
        name: data.name,
        description: data.description || null,
        maxGuests: data.maxGuests,
        basePrice: data.basePrice,
        amenities: data.amenities,
      },
    })

    return NextResponse.json(serializePrismaData({ roomType }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update room type error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
