"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoreVertical, Pencil, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useLanguage } from "@/lib/contexts/language-context"

interface EditReservationButtonProps {
  reservation: {
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
  }
  instanceId: string
}

export function EditReservationButton({ reservation, instanceId }: EditReservationButtonProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      guestName: formData.get("guestName") as string,
      guestEmail: formData.get("guestEmail") as string,
      guestPhone: formData.get("guestPhone") as string,
      status: formData.get("status") as string,
      adults: Number.parseInt(formData.get("adults") as string),
      children: Number.parseInt(formData.get("children") as string) || 0,
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/reservations/${reservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.reservations.failedToUpdate)
        setIsLoading(false)
        return
      }

      setOpen(false)
      router.refresh()
      setIsLoading(false)
    } catch (error) {
      setError(t.auth.errorOccurred)
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t.common.edit}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.reservations.editReservation}</DialogTitle>
            <DialogDescription>{t.reservations.editReservationDescription}</DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">{t.reservations.guestNameRequired}</Label>
              <Input
                id="guestName"
                name="guestName"
                defaultValue={reservation.guestName}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guestEmail">{t.reservations.guestEmail}</Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  defaultValue={reservation.guestEmail || ""}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone">{t.reservations.guestPhone}</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  type="tel"
                  defaultValue={reservation.guestPhone || ""}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.reservations.checkInDate}</Label>
                <Input value={format(new Date(reservation.checkIn), "MMM dd, yyyy")} disabled />
              </div>

              <div className="space-y-2">
                <Label>{t.reservations.checkOutDate}</Label>
                <Input value={format(new Date(reservation.checkOut), "MMM dd, yyyy")} disabled />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adults">{t.reservations.adults} *</Label>
                <Input
                  id="adults"
                  name="adults"
                  type="number"
                  min="1"
                  defaultValue={reservation.adults}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">{t.reservations.children}</Label>
                <Input
                  id="children"
                  name="children"
                  type="number"
                  min="0"
                  defaultValue={reservation.children}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t.reservations.status} *</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                defaultValue={reservation.status}
              >
                <option value="PENDING">{t.reservations.pending}</option>
                <option value="CONFIRMED">{t.reservations.confirmed}</option>
                <option value="CHECKED_IN">{t.reservations.checkedIn}</option>
                <option value="CHECKED_OUT">{t.reservations.checkedOut}</option>
                <option value="CANCELLED">{t.reservations.cancelled}</option>
              </select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.common.saveChanges}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
