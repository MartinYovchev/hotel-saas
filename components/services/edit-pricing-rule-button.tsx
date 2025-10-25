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
import { Pencil, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface EditPricingRuleButtonProps {
  rule: {
    id: string
    name: string
    description: string | null
    ruleType: string
    startDate: Date | null
    endDate: Date | null
    adjustment: any
    isPercentage: boolean
    isActive: boolean
    priority: number
  }
  instanceId: string
}

export function EditPricingRuleButton({ rule, instanceId }: EditPricingRuleButtonProps) {
  const router = useRouter()
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
      const response = await fetch(`/api/instances/${instanceId}/pricing-rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update pricing rule")
        setIsLoading(false)
        return
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
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
          <DialogTitle>Edit Pricing Rule</DialogTitle>
          <DialogDescription>Update pricing rule details</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name *</Label>
            <Input id="name" name="name" defaultValue={rule.name} required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={rule.description || ""}
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ruleType">Rule Type *</Label>
              <select
                id="ruleType"
                name="ruleType"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                defaultValue={rule.ruleType}
              >
                <option value="SEASONAL">Seasonal</option>
                <option value="WEEKEND">Weekend</option>
                <option value="WEEKDAY">Weekday</option>
                <option value="SPECIAL">Special</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                min="0"
                defaultValue={rule.priority}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={rule.startDate ? format(new Date(rule.startDate), "yyyy-MM-dd") : ""}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={rule.endDate ? format(new Date(rule.endDate), "yyyy-MM-dd") : ""}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="adjustment">Adjustment *</Label>
              <Input
                id="adjustment"
                name="adjustment"
                type="number"
                step="0.01"
                defaultValue={Number(rule.adjustment).toFixed(2)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPercentage">Adjustment Type *</Label>
              <select
                id="isPercentage"
                name="isPercentage"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
                defaultValue={rule.isPercentage ? "true" : "false"}
              >
                <option value="true">Percentage (%)</option>
                <option value="false">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={rule.isActive}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
