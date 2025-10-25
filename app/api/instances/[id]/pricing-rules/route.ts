import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const createPricingRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  ruleType: z.enum(["SEASONAL", "WEEKEND", "WEEKDAY", "SPECIAL"]),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  adjustment: z.number(),
  isPercentage: z.boolean().default(true),
  isActive: z.boolean().default(true),
  priority: z.number().min(0).default(0),
})

export async function POST(request: Request, { params }: { params: { id: string } }) {
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
    const data = createPricingRuleSchema.parse(body)

    const pricingRule = await prisma.pricingRule.create({
      data: {
        instanceId: params.id,
        name: data.name,
        description: data.description || null,
        ruleType: data.ruleType,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        adjustment: data.adjustment,
        isPercentage: data.isPercentage,
        isActive: data.isActive,
        priority: data.priority,
      },
    })

    return NextResponse.json({ pricingRule }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Create pricing rule error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
