"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/contexts/language-context"

interface ReservationFiltersProps {
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export function ReservationFilters({ statusFilter, onStatusFilterChange }: ReservationFiltersProps) {
  const { t } = useLanguage()

  return (
    <Tabs value={statusFilter} onValueChange={onStatusFilterChange}>
      <TabsList>
        <TabsTrigger value="all">{t.reservations.all}</TabsTrigger>
        <TabsTrigger value="PENDING">{t.reservations.pending}</TabsTrigger>
        <TabsTrigger value="CONFIRMED">{t.reservations.confirmed}</TabsTrigger>
        <TabsTrigger value="CHECKED_IN">{t.reservations.checkedIn}</TabsTrigger>
        <TabsTrigger value="CHECKED_OUT">{t.reservations.checkedOut}</TabsTrigger>
        <TabsTrigger value="CANCELLED">{t.reservations.cancelled}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
