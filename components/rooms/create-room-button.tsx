"use client"

import type React from "react"

import { useState } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface CreateRoomButtonProps {
  instanceId: string
  roomTypes: Array<{
    id: string
    name: string
  }>
}

export function CreateRoomButton({ instanceId, roomTypes }: CreateRoomButtonProps) {
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
      roomNumber: formData.get("roomNumber") as string,
      roomTypeId: formData.get("roomTypeId") as string,
      floor: formData.get("floor") ? Number.parseInt(formData.get("floor") as string) : null,
      status: formData.get("status") as string,
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.rooms.failedToCreateRoom)
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

  if (roomTypes.length === 0) {
    return (
      <Button disabled>
        <Plus className="mr-2 h-4 w-4" />
        {t.rooms.addRoom}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t.rooms.addRoom}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.rooms.createRoom}</DialogTitle>
          <DialogDescription>{t.rooms.createRoomDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomNumber">{t.rooms.roomNumberRequired}</Label>
            <Input id="roomNumber" name="roomNumber" placeholder={t.rooms.roomNumberPlaceholder} required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomTypeId">{t.rooms.roomType} *</Label>
            <select
              id="roomTypeId"
              name="roomTypeId"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              <option value="">{t.rooms.selectRoomType}</option>
              {roomTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="floor">{t.rooms.floor}</Label>
              <Input id="floor" name="floor" type="number" placeholder={t.rooms.floorPlaceholder} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t.rooms.status} *</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                defaultValue="AVAILABLE"
              >
                <option value="AVAILABLE">{t.rooms.available}</option>
                <option value="OCCUPIED">{t.rooms.occupied}</option>
                <option value="MAINTENANCE">{t.rooms.maintenance}</option>
                <option value="CLEANING">Cleaning</option>
              </select>
            </div>
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
              {t.rooms.createRoom}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
