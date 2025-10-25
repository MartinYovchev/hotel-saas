"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReservationFiltersProps {
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function ReservationFilters({ statusFilter, onStatusFilterChange }: ReservationFiltersProps) {
  return (
    <Tabs value={statusFilter} onValueChange={onStatusFilterChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="PENDING">Pending</TabsTrigger>
        <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
        <TabsTrigger value="CHECKED_IN">Checked In</TabsTrigger>
        <TabsTrigger value="CHECKED_OUT">Checked Out</TabsTrigger>
        <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
