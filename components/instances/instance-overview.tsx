"use client"

import Link from "next/link"
import { Building2, Bed, Calendar, Settings, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InstanceOverviewProps {
  instance: {
    id: string
    name: string
    address: string | null
    contactEmail: string | null
    contactPhone: string | null
    currency: string
    timezone: string
    _count: {
      rooms: number
      reservations: number
      services: number
    }
  }
}

export function InstanceOverview({ instance }: InstanceOverviewProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{instance.name}</h1>
                  {instance.address && <p className="mt-1 text-sm text-slate-600">{instance.address}</p>}
                </div>
              </div>
            </div>
            <Link href={`/instances/${instance.id}/settings`}>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Rooms</CardTitle>
              <Bed className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instance._count.rooms}</div>
              <Link
                href={`/instances/${instance.id}/rooms`}
                className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-500"
              >
                Manage rooms →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instance._count.reservations}</div>
              <Link
                href={`/instances/${instance.id}/reservations`}
                className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-500"
              >
                View bookings →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Services</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instance._count.services}</div>
              <Link
                href={`/instances/${instance.id}/services`}
                className="mt-2 inline-block text-xs text-blue-600 hover:text-blue-500"
              >
                Manage services →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Currency</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instance.currency}</div>
              <p className="mt-2 text-xs text-slate-600">Timezone: {instance.timezone}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={`/instances/${instance.id}/rooms`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <Bed className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Manage Rooms</h3>
                    <p className="text-sm text-slate-600">Add and configure rooms</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/instances/${instance.id}/reservations`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Reservations</h3>
                    <p className="text-sm text-slate-600">View and manage bookings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/instances/${instance.id}/settings`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <Settings className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Settings</h3>
                    <p className="text-sm text-slate-600">Configure property details</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
