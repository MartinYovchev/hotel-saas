import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReportsView } from "@/components/reports/reports-view"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = 'force-dynamic'

export default async function ReportsPage({
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View occupancy, revenue, and performance metrics</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ReportsView instanceId={id} currency={instance.currency} />
      </Suspense>
    </div>
  )
}
