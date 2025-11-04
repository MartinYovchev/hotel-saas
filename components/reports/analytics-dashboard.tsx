"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Bed, TrendingUp, BarChart3, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { formatCurrency, getCurrencySymbol } from "@/lib/currency"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

interface Metrics {
  totalRevenue: number
  totalReservations: number
  occupancyRate: number
  averageDailyRate: number
  revPAR: number
  cancellationRate: number
}

interface OccupancyData {
  date: string
  totalRooms: number
  occupiedRooms: number
  occupancyRate: number
}

interface RevenueData {
  date: string
  roomRevenue: number
  serviceRevenue: number
  totalRevenue: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function AnalyticsDashboard({ instanceId, currency }: { instanceId: string; currency: string }) {
  const { t } = useLanguage()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)

      // Fetch metrics
      const metricsResponse = await fetch(`/api/instances/${instanceId}/reports/metrics`)
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        // Convert to numbers in case of Decimal types from Prisma
        const totalRevenue = Number(metricsData.totalRevenue)
        const occupancyRate = Number(metricsData.occupancyRate)
        const averageDailyRate = Number(metricsData.averageDailyRate)
        const totalReservations = Number(metricsData.totalReservations)
        // Calculate additional metrics
        const revPAR = averageDailyRate * (occupancyRate / 100)
        setMetrics({ totalRevenue, occupancyRate, averageDailyRate, totalReservations, revPAR, cancellationRate: 0 })
      }

      // Fetch occupancy data
      const occupancyResponse = await fetch(`/api/instances/${instanceId}/reports/occupancy`)
      if (occupancyResponse.ok) {
        const data = await occupancyResponse.json()
        // Convert to numbers
        const occupancyData = data.map((item: any) => ({
          ...item,
          totalRooms: Number(item.totalRooms),
          occupiedRooms: Number(item.occupiedRooms),
          occupancyRate: Number(item.occupancyRate),
        }))
        setOccupancyData(occupancyData)
      }

      // Fetch revenue data
      const revenueResponse = await fetch(`/api/instances/${instanceId}/reports/revenue`)
      if (revenueResponse.ok) {
        const data = await revenueResponse.json()
        // Convert to numbers
        const revenueData = data.map((item: any) => ({
          ...item,
          roomRevenue: Number(item.roomRevenue),
          serviceRevenue: Number(item.serviceRevenue),
          totalRevenue: Number(item.totalRevenue),
        }))
        setRevenueData(revenueData)
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">{t.common.loading}</div>
      </div>
    )
  }

  // Calculate revenue breakdown for pie chart
  const revenueBreakdown = [
    {
      name: t.reports.roomRevenue || "Room Revenue",
      value: revenueData.reduce((sum, item) => sum + item.roomRevenue, 0),
    },
    {
      name: t.reports.serviceRevenue || "Service Revenue",
      value: revenueData.reduce((sum, item) => sum + item.serviceRevenue, 0),
    },
  ]

  // Format data for charts
  const chartData = revenueData.map((item, index) => ({
    date: format(new Date(item.date), "MMM dd"),
    revenue: item.totalRevenue,
    roomRevenue: item.roomRevenue,
    serviceRevenue: item.serviceRevenue,
    occupancyRate: occupancyData[index]?.occupancyRate || 0,
  }))

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.totalRevenue || "Total Revenue"}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue, currency)}</div>
            <p className="text-xs text-muted-foreground">{t.reports.last30Days || "Last 30 days"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.totalReservations || "Reservations"}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReservations}</div>
            <p className="text-xs text-muted-foreground">{t.reports.last30Days || "Last 30 days"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.occupancyRate}</CardTitle>
            <Bed className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t.reports.last30Days || "Last 30 days"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.averageDailyRate}</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.averageDailyRate, currency)}</div>
            <p className="text-xs text-muted-foreground">{t.reports.last30Days || "Last 30 days"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.revPAR || "RevPAR"}</CardTitle>
            <BarChart3 className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revPAR, currency)}</div>
            <p className="text-xs text-muted-foreground">{t.reports.revenuePerAvailableRoom || "Revenue Per Available Room"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.avgStayDuration || "Avg Stay Duration"}</CardTitle>
            <Calendar className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.totalReservations > 0 ? 30 / metrics.totalReservations * 2.5 : 0).toFixed(1)} {t.reservations.nights.toLowerCase()}</div>
            <p className="text-xs text-muted-foreground">{t.reports.last30Days || "Last 30 days"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t.reports.revenueTrend || "Revenue Trend"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value, currency)}
                contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #ccc" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0088FE"
                strokeWidth={2}
                name={t.reports.totalRevenue || "Total Revenue"}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Occupancy Trend Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{t.reports.occupancyTrend || "Occupancy Trend"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #ccc" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="occupancyRate"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
                name={t.reports.occupancyRate}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown and Comparison Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Breakdown Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t.reports.revenueBreakdown || "Revenue Breakdown"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value, currency)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Composition Stacked Bar Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t.reports.revenueComposition || "Revenue Composition"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "1px solid #ccc" }}
                />
                <Legend />
                <Bar
                  dataKey="roomRevenue"
                  stackId="a"
                  fill="#0088FE"
                  name={t.reports.roomRevenue || "Room Revenue"}
                />
                <Bar
                  dataKey="serviceRevenue"
                  stackId="a"
                  fill="#00C49F"
                  name={t.reports.serviceRevenue || "Service Revenue"}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
