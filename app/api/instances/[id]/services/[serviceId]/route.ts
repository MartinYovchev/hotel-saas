import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const updateServiceSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  taxRate: z.number().min(0).max(100).nullable().optional(),
  isRefundable: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string; serviceId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
    const data = updateServiceSchema.parse(body)

    const service = await prisma.service.update({
      where: {
        id: params.serviceId,
        instanceId: params.id,
      },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        taxRate: data.taxRate,
        isRefundable: data.isRefundable,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({ service })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
