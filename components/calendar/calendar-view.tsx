"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"

interface Reservation {
  id: string
  guestName: string
  checkIn: string
  checkOut: string
  status: string
  room: {
    roomNumber: string
  }
}

export function CalendarView({ instanceId }: { instanceId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [currentDate])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instances/${instanceId}/reservations`)
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getReservationsForDay = (day: Date) => {
    return reservations.filter((reservation) => {
      const checkIn = new Date(reservation.checkIn)
      const checkOut = new Date(reservation.checkOut)
      return day >= checkIn && day <= checkOut
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500"
      case "PENDING":
        return "bg-yellow-500"
      case "CHECKED_IN":
        return "bg-blue-500"
      case "CHECKED_OUT":
        return "bg-gray-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            const dayReservations = getReservationsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                className={`min-h-24 rounded-lg border p-2 ${
                  isCurrentMonth ? "bg-background" : "bg-muted/50"
                } ${isToday ? "border-primary" : ""}`}
              >
                <div className="mb-1 text-sm font-medium">{format(day, "d")}</div>
                <div className="space-y-1">
                  {dayReservations.slice(0, 3).map((reservation) => (
                    <div key={reservation.id} className="rounded bg-primary/10 px-1 py-0.5 text-xs">
                      <div className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(reservation.status)}`} />
                        <span className="truncate">{reservation.room.roomNumber}</span>
                      </div>
                    </div>
                  ))}
                  {dayReservations.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayReservations.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm">Checked In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
            <span className="text-sm">Checked Out</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm">Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
