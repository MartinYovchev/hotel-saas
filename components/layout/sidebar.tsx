"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2, Bed, Calendar, DollarSign, BarChart3, Settings } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface SidebarProps {
  instanceId?: string
}

export function Sidebar({ instanceId }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navigation = instanceId
    ? [
        {
          name: t.navigation.overview,
          href: `/instances/${instanceId}`,
          icon: LayoutDashboard,
        },
        {
          name: t.navigation.rooms,
          href: `/instances/${instanceId}/rooms`,
          icon: Bed,
        },
        {
          name: t.navigation.reservations,
          href: `/instances/${instanceId}/reservations`,
          icon: Calendar,
        },
        {
          name: t.navigation.services,
          href: `/instances/${instanceId}/services`,
          icon: DollarSign,
        },
        {
          name: t.navigation.calendar,
          href: `/instances/${instanceId}/calendar`,
          icon: Calendar,
        },
        {
          name: t.navigation.reports,
          href: `/instances/${instanceId}/reports`,
          icon: BarChart3,
        },
        {
          name: t.navigation.settings,
          href: `/instances/${instanceId}/settings`,
          icon: Settings,
        },
      ]
    : [
        {
          name: t.navigation.dashboard,
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Building2 className="mr-2 h-6 w-6" />
        <span className="text-lg font-semibold">{t.app.title}</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
