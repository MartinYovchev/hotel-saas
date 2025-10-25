"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ReservationList } from "./reservation-list"
import { CreateReservationButton } from "./create-reservation-button"
import { ReservationFilters } from "./reservation-filters"

interface ReservationManagementProps {
  instance: {
    id: string
    name: string
    currency: string
  }
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
  rooms: Array<{
    id: string
    roomNumber: string
    status: string
    roomType: {
      id: string
      name: string
      basePrice: any
    }
  }>
}

export function ReservationManagement({ instance, reservations, rooms }: ReservationManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href={`/instances/${instance.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">Reservations</h1>
              <p className="mt-1 text-sm text-slate-600">{instance.name}</p>
            </div>
            <CreateReservationButton instanceId={instance.id} rooms={rooms} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ReservationFilters statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />

        <div className="mt-6">
          <ReservationList reservations={filteredReservations} instanceId={instance.id} currency={instance.currency} />
        </div>
      </div>
    </div>
  )
}
