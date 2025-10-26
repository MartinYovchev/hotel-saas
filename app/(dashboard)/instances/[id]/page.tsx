import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InstanceOverview } from "@/components/instances/instance-overview"
import { notFound } from "next/navigation"
import { serializePrismaData } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function InstancePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const { id } = await params

  const instance = await prisma.instance.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
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

  if (!instance) {
    notFound()
  }

  return <InstanceOverview instance={serializePrismaData(instance)} />
}
