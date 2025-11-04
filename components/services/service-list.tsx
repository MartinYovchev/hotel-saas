"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"
import { EditServiceButton } from "./edit-service-button"
import { useLanguage } from "@/lib/contexts/language-context"
import { formatCurrency } from "@/lib/currency"

interface ServiceListProps {
  services: Array<{
    id: string
    name: string
    description: string | null
    price: any
    taxRate: any | null
    isRefundable: boolean
    isActive: boolean
  }>
  instanceId: string
  currency: string
}

export function ServiceList({ services, instanceId, currency }: ServiceListProps) {
  const { t } = useLanguage()

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <DollarSign className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{t.services.noServices}</h3>
        <p className="mt-2 text-sm text-slate-600">{t.services.noServicesDescription}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                {service.description && <p className="mt-1 text-sm text-slate-600">{service.description}</p>}
              </div>
              <EditServiceButton service={service} instanceId={instanceId} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {formatCurrency(Number(service.price), currency)}
              </span>
            </div>

            {service.taxRate && <p className="text-sm text-slate-600">{t.services.tax}: {Number(service.taxRate).toFixed(1)}%</p>}

            <div className="flex flex-wrap gap-2">
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? t.services.active : t.services.inactive}
              </Badge>
              <Badge variant="secondary">{service.isRefundable ? t.services.refundable : t.services.nonRefundable}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
