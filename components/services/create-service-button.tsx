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
import { Plus, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function CreateServiceButton({ instanceId }: { instanceId: string }) {
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
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      taxRate: formData.get("taxRate") ? Number.parseFloat(formData.get("taxRate") as string) : null,
      isRefundable: formData.get("isRefundable") === "true",
      isActive: formData.get("isActive") === "true",
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.services.failedToCreate)
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t.services.addService}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.services.createService}</DialogTitle>
          <DialogDescription>{t.services.createServiceDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.services.serviceNameRequired}</Label>
            <Input id="name" name="name" placeholder={t.services.serviceNamePlaceholder} required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.services.description}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t.services.descriptionPlaceholder}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">{t.services.priceRequired}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder={t.services.pricePlaceholder}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">{t.services.taxRate}</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder={t.services.taxRatePlaceholder}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRefundable"
                name="isRefundable"
                value="true"
                defaultChecked
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="isRefundable" className="cursor-pointer">
                {t.services.refundable}
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                value="true"
                defaultChecked
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                {t.services.active}
              </Label>
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
              {t.services.createService}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
