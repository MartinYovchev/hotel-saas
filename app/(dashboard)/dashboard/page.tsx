import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { serializePrismaData } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

async function getInstances(userId: string) {
  const { prisma } = await import("@/lib/prisma")
  return await prisma.instance.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rooms: true,
          reservations: true,
        },
      },
    },
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const instances = await getInstances(session.user.id)

  // If no instances, redirect to onboarding
  if (instances.length === 0) {
    redirect("/onboarding")
  }

  const serializedInstances = serializePrismaData(instances)

  return <DashboardContent instances={serializedInstances} />
}
