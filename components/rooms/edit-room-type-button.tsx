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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Loader2, X } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface EditRoomTypeButtonProps {
  roomType: {
    id: string
    name: string
    description: string | null
    maxGuests: number
    basePrice: any
    amenities: any
  }
  instanceId: string
}

export function EditRoomTypeButton({ roomType, instanceId }: EditRoomTypeButtonProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amenities, setAmenities] = useState<string[]>(Array.isArray(roomType.amenities) ? roomType.amenities : [])
  const [amenityInput, setAmenityInput] = useState("")

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()])
      setAmenityInput("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      maxGuests: Number.parseInt(formData.get("maxGuests") as string),
      basePrice: Number.parseFloat(formData.get("basePrice") as string),
      amenities,
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/room-types/${roomType.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.rooms.failedToUpdateRoomType)
        setIsLoading(false)
        return
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      setError(t.auth.errorOccurred)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.rooms.editRoomType}</DialogTitle>
          <DialogDescription>{t.rooms.editRoomTypeDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.rooms.roomTypeNameRequired}</Label>
            <Input id="name" name="name" defaultValue={roomType.name} required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.rooms.description}</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={roomType.description || ""}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxGuests">{t.rooms.maxGuestsRequired}</Label>
              <Input
                id="maxGuests"
                name="maxGuests"
                type="number"
                min="1"
                defaultValue={roomType.maxGuests}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basePrice">{t.rooms.basePriceRequired}</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={Number(roomType.basePrice).toFixed(2)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenity">{t.rooms.amenities}</Label>
            <div className="flex gap-2">
              <Input
                id="amenity"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder={t.rooms.addAmenityPlaceholder}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addAmenity()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addAmenity} disabled={isLoading}>
                {t.common.add}
              </Button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-sm">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
  )
}
