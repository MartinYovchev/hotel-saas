"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { OccupancyReport } from "./occupancy-report"
import { RevenueReport } from "./revenue-report"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { RoomAvailability } from "./room-availability"
import { useLanguage } from "@/lib/contexts/language-context"

export function ReportsView({ instanceId }: { instanceId: string }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleExport = async (reportType: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instances/${instanceId}/reports/export?type=${reportType}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${reportType}-report-${new Date().toISOString()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to export report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">{t.reports.overview}</TabsTrigger>
        <TabsTrigger value="availability">{t.reports.availability || "Availability"}</TabsTrigger>
        <TabsTrigger value="occupancy">{t.reports.occupancy}</TabsTrigger>
        <TabsTrigger value="revenue">{t.reports.revenue}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <AnalyticsDashboard instanceId={instanceId} />
      </TabsContent>

      <TabsContent value="availability" className="space-y-4">
        <RoomAvailability instanceId={instanceId} />
      </TabsContent>

      <TabsContent value="occupancy" className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => handleExport("occupancy")} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {t.reports.exportCSV}
          </Button>
        </div>
        <OccupancyReport instanceId={instanceId} />
      </TabsContent>

      <TabsContent value="revenue" className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => handleExport("revenue")} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {t.reports.exportCSV}
          </Button>
        </div>
        <RevenueReport instanceId={instanceId} />
      </TabsContent>
    </Tabs>
  )
}
