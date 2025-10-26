"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2 } from "lucide-react"
import { differenceInDays } from "date-fns"

interface CreateReservationButtonProps {
  instanceId: string
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

export function CreateReservationButton({ instanceId, rooms }: CreateReservationButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [checkIn, setCheckIn] = useState<string>("")
  const [checkOut, setCheckOut] = useState<string>("")
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0)

  const availableRooms = rooms.filter((room) => room.status === "AVAILABLE")

  // Automatically calculate price when room or dates change
  useEffect(() => {
    if (!selectedRoom || !checkIn || !checkOut) {
      setCalculatedPrice(0)
      return
    }

    const room = rooms.find((r) => r.id === selectedRoom)
    if (!room) return

    const nights = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (nights > 0) {
      const price = Number(room.roomType.basePrice) * nights
      setCalculatedPrice(price)
    } else {
      setCalculatedPrice(0)
    }
  }, [selectedRoom, checkIn, checkOut, rooms])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      roomId: formData.get("roomId") as string,
      guestName: formData.get("guestName") as string,
      guestEmail: formData.get("guestEmail") as string,
      guestPhone: formData.get("guestPhone") as string,
      checkIn: formData.get("checkIn") as string,
      checkOut: formData.get("checkOut") as string,
      adults: Number.parseInt(formData.get("adults") as string),
      children: Number.parseInt(formData.get("children") as string) || 0,
      totalPrice: calculatedPrice,
      notes: formData.get("notes") as string,
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create reservation")
        setIsLoading(false)
        return
      }

      setOpen(false)
      setSelectedRoom("")
      setCheckIn("")
      setCheckOut("")
      setCalculatedPrice(0)
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (availableRooms.length === 0) {
    return (
      <Button disabled>
        <Plus className="mr-2 h-4 w-4" />
        New Reservation
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Reservation</DialogTitle>
          <DialogDescription>Add a new booking for your property</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input id="guestName" name="guestName" placeholder="John Doe" required disabled={isLoading} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Guest Email</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                placeholder="john@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Guest Phone</Label>
              <Input id="guestPhone" name="guestPhone" type="tel" placeholder="+1234567890" disabled={isLoading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomId">Room *</Label>
            <select
              id="roomId"
              name="roomId"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">Select a room</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} - {room.roomType.name} ($
                  {Number(room.roomType.basePrice).toFixed(2)}/night)
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Check-In Date *</Label>
              <Input
                id="checkIn"
                name="checkIn"
                type="date"
                required
                disabled={isLoading}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Check-Out Date *</Label>
              <Input
                id="checkOut"
                name="checkOut"
                type="date"
                required
                disabled={isLoading}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults *</Label>
              <Input id="adults" name="adults" type="number" min="1" defaultValue="1" required disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Children</Label>
              <Input id="children" name="children" type="number" min="0" defaultValue="0" disabled={isLoading} />
            </div>
          </div>

          {calculatedPrice > 0 && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Total Price</span>
                <span className="text-lg font-bold text-blue-900">${calculatedPrice.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-blue-700">
                {checkIn && checkOut ? `${differenceInDays(new Date(checkOut), new Date(checkIn))} night(s)` : ""}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Special requests or additional information"
              disabled={isLoading}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || calculatedPrice === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Reservation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
