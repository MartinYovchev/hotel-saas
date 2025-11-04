import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { serializePrismaData } from "@/lib/serialize"

const updateInstanceSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  address: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateInstanceSchema.parse(body)

    // Verify ownership
    const existingInstance = await prisma.instance.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingInstance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    const instance = await prisma.instance.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        timezone: data.timezone,
        currency: data.currency,
      },
    })

    return NextResponse.json(serializePrismaData({ instance }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update instance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existingInstance = await prisma.instance.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingInstance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    await prisma.instance.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Instance deleted successfully" })
  } catch (error) {
    console.error("Delete instance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
