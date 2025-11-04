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

export function CreatePricingRuleButton({ instanceId }: { instanceId: string }) {
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
      ruleType: formData.get("ruleType") as string,
      startDate: formData.get("startDate") || null,
      endDate: formData.get("endDate") || null,
      adjustment: Number.parseFloat(formData.get("adjustment") as string),
      isPercentage: formData.get("isPercentage") === "true",
      isActive: formData.get("isActive") === "true",
      priority: Number.parseInt(formData.get("priority") as string),
    }

    try {
      const response = await fetch(`/api/instances/${instanceId}/pricing-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.services.failedToCreateRule)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t.services.addPricingRule}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.services.createPricingRule}</DialogTitle>
          <DialogDescription>{t.services.createPricingRuleDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.services.ruleNameRequired}</Label>
            <Input id="name" name="name" placeholder={t.services.ruleNamePlaceholder} required disabled={isLoading} />
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
              <Label htmlFor="ruleType">{t.services.ruleType} *</Label>
              <select
                id="ruleType"
                name="ruleType"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              >
                <option value="SEASONAL">{t.services.seasonal}</option>
                <option value="WEEKEND">{t.services.weekend}</option>
                <option value="WEEKDAY">{t.services.weekday}</option>
                <option value="SPECIAL">{t.services.special}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">{t.services.priority} *</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                min="0"
                defaultValue="0"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">{t.services.priorityDescription}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t.services.startDate}</Label>
              <Input id="startDate" name="startDate" type="date" disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{t.services.endDate}</Label>
              <Input id="endDate" name="endDate" type="date" disabled={isLoading} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adjustment">{t.services.adjustment} *</Label>
              <Input
                id="adjustment"
                name="adjustment"
                type="number"
                step="0.01"
                placeholder={t.services.adjustmentPlaceholder}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">{t.services.adjustmentNote}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPercentage">{t.services.adjustmentType} *</Label>
              <select
                id="isPercentage"
                name="isPercentage"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                defaultValue="true"
              >
                <option value="true">{t.services.percentage} (%)</option>
                <option value="false">{t.services.fixedAmount}</option>
              </select>
            </div>
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
              {t.services.createPricingRule}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
