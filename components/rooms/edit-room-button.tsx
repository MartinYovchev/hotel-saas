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
import { useLanguage } from "@/lib/contexts/language-context"

interface EditRoomButtonProps {
  room: {
    id: string
    roomNumber: string
    status: string
    floor: number | null
    roomType: {
      id: string
      name: string
    }
  }
  instanceId: string
}

export function EditRoomButton({ room, instanceId }: EditRoomButtonProps) {
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
      floor: formData.get("floor") ? Number.parseInt(formData.get("floor") as string) : null,
      status: formData.get("status") as string,
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.rooms.failedToUpdateRoom)
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.rooms.editRoom}</DialogTitle>
            <DialogDescription>{t.rooms.editRoomDescription}</DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">{t.rooms.roomNumberRequired}</Label>
              <Input id="roomNumber" name="roomNumber" defaultValue={room.roomNumber} required disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label>{t.rooms.roomType}</Label>
              <Input value={room.roomType.name} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="floor">{t.rooms.floor}</Label>
                <Input id="floor" name="floor" type="number" defaultValue={room.floor || ""} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t.rooms.status} *</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                  defaultValue={room.status}
                >
                  <option value="AVAILABLE">{t.rooms.available}</option>
                  <option value="OCCUPIED">{t.rooms.occupied}</option>
                  <option value="MAINTENANCE">{t.rooms.maintenance}</option>
                  <option value="CLEANING">{t.rooms.cleaning}</option>
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
                {t.common.saveChanges}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
