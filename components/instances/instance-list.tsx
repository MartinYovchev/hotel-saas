"use client"

import Link from "next/link"
import { Building2, Bed, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface InstanceListProps {
  instances: Instance[]
}

export function InstanceList({ instances }: InstanceListProps) {
  const { t } = useLanguage()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {instances.map((instance) => (
        <Link key={instance.id} href={`/instances/${instance.id}`}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{instance.name}</CardTitle>
                    {instance.address && <p className="mt-1 text-sm text-slate-600">{instance.address}</p>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span>{instance._count.rooms} {t.rooms.rooms.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{instance._count.reservations} {t.instance.reservations.toLowerCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
