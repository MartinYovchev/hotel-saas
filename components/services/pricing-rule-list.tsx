"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { EditPricingRuleButton } from "./edit-pricing-rule-button"

interface PricingRuleListProps {
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
  instanceId: string
}

const ruleTypeLabels = {
  SEASONAL: "Seasonal",
  WEEKEND: "Weekend",
  WEEKDAY: "Weekday",
  SPECIAL: "Special",
}

export function PricingRuleList({ pricingRules, instanceId }: PricingRuleListProps) {
  if (pricingRules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <TrendingUp className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No pricing rules yet</h3>
        <p className="mt-2 text-sm text-slate-600">
          Create rules for seasonal rates, weekend pricing, and special offers
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pricingRules.map((rule) => (
        <Card key={rule.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{rule.name}</CardTitle>
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{ruleTypeLabels[rule.ruleType as keyof typeof ruleTypeLabels]}</Badge>
                </div>
                {rule.description && <p className="mt-1 text-sm text-slate-600">{rule.description}</p>}
              </div>
              <EditPricingRuleButton rule={rule} instanceId={instanceId} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600">Adjustment</p>
                <p className="text-lg font-semibold text-slate-900">
                  {Number(rule.adjustment) > 0 ? "+" : ""}
                  {Number(rule.adjustment).toFixed(rule.isPercentage ? 1 : 2)}
                  {rule.isPercentage ? "%" : " fixed"}
                </p>
              </div>

              {rule.startDate && rule.endDate && (
                <div>
                  <p className="text-sm text-slate-600">Date Range</p>
                  <p className="text-sm font-medium text-slate-900">
                    {format(new Date(rule.startDate), "MMM dd, yyyy")} -{" "}
                    {format(new Date(rule.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600">Priority</p>
                <p className="text-lg font-semibold text-slate-900">{rule.priority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
