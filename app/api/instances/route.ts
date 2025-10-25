import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createInstanceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  timezone: z.string().default("UTC"),
  currency: z.string().default("USD"),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createInstanceSchema.parse(body)

    const instance = await prisma.instance.create({
      data: {
        userId: session.user.id,
        name: data.name,
        address: data.address || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        timezone: data.timezone,
        currency: data.currency,
        settings: {
          checkInTime: "15:00",
          checkOutTime: "11:00",
          labels: {
            room: "Room",
            reservation: "Booking",
          },
        },
      },
    })

    return NextResponse.json({ instance }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create instance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instances = await prisma.instance.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            rooms: true,
            reservations: true,
            services: true,
          },
        },
      },
    })

    return NextResponse.json({ instances })
  } catch (error) {
    console.error("Get instances error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
