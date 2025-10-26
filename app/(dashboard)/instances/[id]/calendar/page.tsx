import { Suspense } from "react"
import { CalendarView } from "@/components/calendar/calendar-view"
import { Skeleton } from "@/components/ui/skeleton"

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and manage reservations in calendar format</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CalendarView instanceId={id} />
      </Suspense>
    </div>
  )
}
