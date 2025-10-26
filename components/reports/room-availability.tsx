"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Calendar, TrendingUp, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { format, parseISO } from "date-fns"

interface RoomAvailabilityData {
  roomId: string
  roomNumber: string
  roomType: string
  status: string
  dailyAvailability: Array<{ date: string; available: boolean }>
  availableDays: number
  occupancyRate: number
}

interface AvailabilityStats {
  totalRooms: number
  currentlyAvailable: number
  totalAvailableRoomNights: number
  totalOccupiedRoomNights: number
  totalPossibleRoomNights: number
  overallOccupancyRate: number
}

interface AvailabilityByType {
  roomType: string
  totalRooms: number
  availableNights: number
  occupancyRate: number
}

export function RoomAvailability({ instanceId }: { instanceId: string }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState("")
  const [daysInMonth, setDaysInMonth] = useState<string[]>([])
  const [statistics, setStatistics] = useState<AvailabilityStats | null>(null)
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailabilityData[]>([])
  const [availabilityByType, setAvailabilityByType] = useState<AvailabilityByType[]>([])

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instances/${instanceId}/reports/availability`)
      if (response.ok) {
        const data = await response.json()
        setMonth(data.month)
        setDaysInMonth(data.daysInMonth)
        setStatistics({
          ...data.statistics,
          totalRooms: Number(data.statistics.totalRooms),
          currentlyAvailable: Number(data.statistics.currentlyAvailable),
          totalAvailableRoomNights: Number(data.statistics.totalAvailableRoomNights),
          totalOccupiedRoomNights: Number(data.statistics.totalOccupiedRoomNights),
          totalPossibleRoomNights: Number(data.statistics.totalPossibleRoomNights),
          overallOccupancyRate: Number(data.statistics.overallOccupancyRate),
        })
        setRoomAvailability(data.roomAvailability.map((room: any) => ({
          ...room,
          availableDays: Number(room.availableDays),
          occupancyRate: Number(room.occupancyRate),
        })))
        setAvailabilityByType(data.availabilityByType.map((type: any) => ({
          ...type,
          totalRooms: Number(type.totalRooms),
          availableNights: Number(type.availableNights),
          occupancyRate: Number(type.occupancyRate),
        })))
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !statistics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">{t.common.loading}</div>
      </div>
    )
  }

  // Group days by week for better display
  const getDayNumber = (dateStr: string) => {
    const date = parseISO(dateStr)
    return format(date, "d")
  }

  return (
    <div className="space-y-6">
      {/* Month Header */}
      <div>
        <h2 className="text-2xl font-bold">{month}</h2>
        <p className="text-muted-foreground">{t.reports.roomAvailabilityOverview || "Room Availability Overview"}</p>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.availableNow || "Available Now"}</CardTitle>
            <Bed className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.currentlyAvailable} / {statistics.totalRooms}
            </div>
            <p className="text-xs text-muted-foreground">{t.reports.roomsAvailable || "rooms available"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.availableRoomNights || "Available Room-Nights"}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalAvailableRoomNights}</div>
            <p className="text-xs text-muted-foreground">
              {t.reports.outOf || "out of"} {statistics.totalPossibleRoomNights}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.occupancyRate}</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overallOccupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t.reports.currentMonth || "current month"}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.reports.occupiedRoomNights || "Occupied Room-Nights"}</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalOccupiedRoomNights}</div>
            <p className="text-xs text-muted-foreground">{t.reports.totalBooked || "total booked"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Availability by Room Type */}
      <Card>
        <CardHeader>
          <CardTitle>{t.reports.availabilityByRoomType || "Availability by Room Type"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilityByType.map((type) => (
              <div key={type.roomType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{type.roomType}</p>
                    <p className="text-sm text-muted-foreground">
                      {type.availableNights} {t.reports.availableNights || "available nights"} • {type.totalRooms} {t.reports.rooms || "rooms"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{type.occupancyRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">{t.reports.occupied || "occupied"}</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${type.occupancyRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Availability Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t.reports.roomAvailabilityCalendar || "Room Availability Calendar"}</CardTitle>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>{t.reports.available || "Available"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>{t.reports.occupied || "Occupied"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded" />
              <span>{t.reports.unavailable || "Unavailable"}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header with dates */}
              <div className="flex gap-1 mb-2">
                <div className="w-32 flex-shrink-0 font-medium text-sm">
                  {t.reports.room || "Room"}
                </div>
                <div className="flex gap-1 flex-1">
                  {daysInMonth.map((date) => (
                    <div
                      key={date}
                      className="w-6 text-center text-xs font-medium"
                      title={format(parseISO(date), "MMM d")}
                    >
                      {getDayNumber(date)}
                    </div>
                  ))}
                </div>
                <div className="w-24 text-center text-xs font-medium">
                  {t.reports.available || "Available"}
                </div>
              </div>

              {/* Room rows */}
              {roomAvailability.map((room) => (
                <div key={room.roomId} className="flex gap-1 mb-1 items-center">
                  <div className="w-32 flex-shrink-0 text-sm">
                    <div className="font-medium">{room.roomNumber}</div>
                    <div className="text-xs text-muted-foreground truncate">{room.roomType}</div>
                  </div>
                  <div className="flex gap-1 flex-1">
                    {room.dailyAvailability.map((day) => (
                      <div
                        key={day.date}
                        className={`w-6 h-6 rounded ${
                          room.status !== "AVAILABLE"
                            ? "bg-gray-400"
                            : day.available
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        } transition-colors cursor-pointer`}
                        title={`${room.roomNumber} - ${format(parseISO(day.date), "MMM d")}: ${
                          room.status !== "AVAILABLE"
                            ? "Unavailable"
                            : day.available
                            ? "Available"
                            : "Occupied"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-24 text-center text-sm font-medium">
                    {room.availableDays} / {daysInMonth.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>{t.reports.availabilitySummary || "Availability Summary"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">{t.reports.mostAvailableRoom || "Most Available Room"}</p>
              <p className="text-lg font-bold">
                {roomAvailability.length > 0
                  ? roomAvailability.reduce((prev, current) =>
                      current.availableDays > prev.availableDays ? current : prev
                    ).roomNumber
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.reports.leastAvailableRoom || "Least Available Room"}</p>
              <p className="text-lg font-bold">
                {roomAvailability.length > 0
                  ? roomAvailability.reduce((prev, current) =>
                      current.availableDays < prev.availableDays ? current : prev
                    ).roomNumber
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.reports.averageAvailability || "Average Availability"}</p>
              <p className="text-lg font-bold">
                {roomAvailability.length > 0
                  ? (
                      roomAvailability.reduce((sum, room) => sum + room.availableDays, 0) /
                      roomAvailability.length
                    ).toFixed(1)
                  : "0"}{" "}
                {t.reports.days || "days"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
