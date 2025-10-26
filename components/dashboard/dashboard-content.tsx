"use client"

import { Building2 } from "lucide-react"
import { InstanceList } from "@/components/instances/instance-list"
import { CreateInstanceButton } from "@/components/instances/create-instance-button"
import { useLanguage } from "@/lib/contexts/language-context"

interface Instance {
  id: string
  name: string
  address: string | null
  currency: string
  _count: {
    rooms: number
    reservations: number
  }
}

interface DashboardContentProps {
  instances: Instance[]
}

export function DashboardContent({ instances }: DashboardContentProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t.dashboard.myProperties}</h1>
              <p className="mt-1 text-sm text-slate-600">{t.dashboard.myProperties}</p>
            </div>
            <CreateInstanceButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {instances.length > 0 ? (
          <InstanceList instances={instances} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
            <Building2 className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{t.dashboard.noPropertiesTitle}</h3>
            <p className="mt-2 text-sm text-slate-600">{t.dashboard.noPropertiesDescription}</p>
            <div className="mt-6">
              <CreateInstanceButton />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
