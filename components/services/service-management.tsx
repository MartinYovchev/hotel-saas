"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ServiceList } from "./service-list"
import { PricingRuleList } from "./pricing-rule-list"
import { CreateServiceButton } from "./create-service-button"
import { CreatePricingRuleButton } from "./create-pricing-rule-button"

interface ServiceManagementProps {
  instance: {
    id: string
    name: string
    currency: string
  }
  services: Array<{
    id: string
    name: string
    description: string | null
    price: any
    taxRate: any | null
    isRefundable: boolean
    isActive: boolean
  }>
  pricingRules: Array<{
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
  }>
}

export function ServiceManagement({ instance, services, pricingRules }: ServiceManagementProps) {
  const [activeTab, setActiveTab] = useState("services")

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href={`/instances/${instance.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">Services & Pricing</h1>
              <p className="mt-1 text-sm text-slate-600">{instance.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
            </TabsList>
            {activeTab === "services" ? (
              <CreateServiceButton instanceId={instance.id} />
            ) : (
              <CreatePricingRuleButton instanceId={instance.id} />
            )}
          </div>

          <TabsContent value="services" className="mt-6">
            <ServiceList services={services} instanceId={instance.id} currency={instance.currency} />
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <PricingRuleList pricingRules={pricingRules} instanceId={instance.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
