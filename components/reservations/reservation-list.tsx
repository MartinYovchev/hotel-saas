"use client"

import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Bed } from "lucide-react"
import { EditReservationButton } from "./edit-reservation-button"
import { useLanguage } from "@/lib/contexts/language-context"

interface ReservationListProps {
  reservations: Array<{
    id: string
    guestName: string
    guestEmail: string | null
    guestPhone: string | null
    checkIn: Date
    checkOut: Date
    status: string
    totalPrice: any
    adults: number
    children: number
    room: {
      id: string
      roomNumber: string
      roomType: {
        name: string
      }
    }
  }>
  instanceId: string
  currency: string
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CHECKED_IN: "bg-green-100 text-green-800",
  CHECKED_OUT: "bg-slate-100 text-slate-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export function ReservationList({ reservations, instanceId, currency }: ReservationListProps) {
  const { t } = useLanguage()

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return t.reservations.pending
      case "CONFIRMED":
        return t.reservations.confirmed
      case "CHECKED_IN":
        return t.reservations.checkedIn
      case "CHECKED_OUT":
        return t.reservations.checkedOut
      case "CANCELLED":
        return t.reservations.cancelled
      default:
        return status.replace("_", " ")
    }
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <Calendar className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{t.reservations.noReservations}</h3>
        <p className="mt-2 text-sm text-slate-600">{t.reservations.noReservationsDescription}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{reservation.guestName}</h3>
                      <Badge
                        className={
                          statusColors[reservation.status as keyof typeof statusColors] || "bg-slate-100 text-slate-800"
                        }
                      >
                        {getStatusText(reservation.status)}
                      </Badge>
                    </div>
                    {reservation.guestEmail && <p className="mt-1 text-sm text-slate-600">{reservation.guestEmail}</p>}
                    {reservation.guestPhone && <p className="text-sm text-slate-600">{reservation.guestPhone}</p>}
                  </div>
                  <EditReservationButton reservation={reservation} instanceId={instanceId} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Bed className="h-4 w-4" />
                    <span>
                      {t.rooms.roomNumber} {reservation.room.roomNumber} - {reservation.room.roomType.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(reservation.checkIn), "MMM dd, yyyy")} -{" "}
                      {format(new Date(reservation.checkOut), "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-4 w-4" />
                    <span>
                      {reservation.adults} adult{reservation.adults !== 1 ? "s" : ""}
                      {reservation.children > 0 &&
                        `, ${reservation.children} child${reservation.children !== 1 ? "ren" : ""}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-600">{t.reservations.totalPrice}</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {currency} {Number(reservation.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
