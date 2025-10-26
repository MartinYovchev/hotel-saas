import { Suspense } from "react"
import { ReportsView } from "@/components/reports/reports-view"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View occupancy, revenue, and performance metrics</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ReportsView instanceId={id} />
      </Suspense>
    </div>
  )
}
