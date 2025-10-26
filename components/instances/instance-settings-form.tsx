"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface InstanceSettingsFormProps {
  instance: {
    id: string
    name: string
    address: string | null
    contactEmail: string | null
    contactPhone: string | null
    timezone: string
    currency: string
  }
}

export function InstanceSettingsForm({ instance }: InstanceSettingsFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      timezone: formData.get("timezone") as string,
      currency: formData.get("currency") as string,
    }

    try {
      const response = await fetch(`/api/instances/${instance.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.instance.failedToUpdate)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)
      router.refresh()
    } catch (error) {
      setError(t.auth.errorOccurred)
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.instance.propertyInformation}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.onboarding.propertyNameRequired}</Label>
              <Input id="name" name="name" type="text" defaultValue={instance.name} required disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t.onboarding.address}</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={instance.address || ""}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">{t.onboarding.contactEmail}</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={instance.contactEmail || ""}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">{t.onboarding.contactPhone}</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  defaultValue={instance.contactPhone || ""}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">{t.common.timezone}</Label>
                <select
                  id="timezone"
                  name="timezone"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                  defaultValue={instance.timezone}
                >
                  <option value="UTC">{t.timezones.utc}</option>
                  <option value="America/New_York">{t.timezones.easternTime}</option>
                  <option value="America/Chicago">{t.timezones.centralTime}</option>
                  <option value="America/Denver">{t.timezones.mountainTime}</option>
                  <option value="America/Los_Angeles">{t.timezones.pacificTime}</option>
                  <option value="Europe/London">{t.timezones.london}</option>
                  <option value="Europe/Paris">{t.timezones.paris}</option>
                  <option value="Asia/Tokyo">{t.timezones.tokyo}</option>
                  <option value="Asia/Dubai">{t.timezones.dubai}</option>
                  <option value="Europe/Sofia">{t.timezones.sofia}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t.common.currency}</Label>
                <select
                  id="currency"
                  name="currency"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                  defaultValue={instance.currency}
                >
                  <option value="USD">{t.currencies.usd}</option>
                  <option value="EUR">{t.currencies.eur}</option>
                  <option value="GBP">{t.currencies.gbp}</option>
                  <option value="JPY">{t.currencies.jpy}</option>
                  <option value="AUD">{t.currencies.aud}</option>
                  <option value="CAD">{t.currencies.cad}</option>
                  <option value="AED">{t.currencies.aed}</option>
                  <option value="BGN">{t.currencies.bgn}</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{t.instance.settingsUpdated}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.instance.saveChanges}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
