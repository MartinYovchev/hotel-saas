import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ServiceManagement } from "@/components/services/service-management"

export const dynamic = 'force-dynamic'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  const { id } = await params

  if (!session?.user) {
    redirect("/login")
  }

  const instance = await prisma.instance.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
  })

  if (!instance) {
    notFound()
  }

  const services = await prisma.service.findMany({
    where: { instanceId: id },
    orderBy: { createdAt: "asc" },
  })

  const pricingRules = await prisma.pricingRule.findMany({
    where: { instanceId: id },
    orderBy: { priority: "desc" },
  })

  return <ServiceManagement instance={instance} services={services} pricingRules={pricingRules} />
}
