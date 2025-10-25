"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Building2, Bed, Calendar, DollarSign, BarChart3, Settings } from "lucide-react"

interface SidebarProps {
  instanceId?: string
}

export function Sidebar({ instanceId }: SidebarProps) {
  const pathname = usePathname()

  const navigation = instanceId
    ? [
        {
          name: "Overview",
          href: `/instances/${instanceId}`,
          icon: LayoutDashboard,
        },
        {
          name: "Rooms",
          href: `/instances/${instanceId}/rooms`,
          icon: Bed,
        },
        {
          name: "Reservations",
          href: `/instances/${instanceId}/reservations`,
          icon: Calendar,
        },
        {
          name: "Services",
          href: `/instances/${instanceId}/services`,
          icon: DollarSign,
        },
        {
          name: "Calendar",
          href: `/instances/${instanceId}/calendar`,
          icon: Calendar,
        },
        {
          name: "Reports",
          href: `/instances/${instanceId}/reports`,
          icon: BarChart3,
        },
        {
          name: "Settings",
          href: `/instances/${instanceId}/settings`,
          icon: Settings,
        },
      ]
    : [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Building2 className="mr-2 h-6 w-6" />
        <span className="text-lg font-semibold">Hotel SaaS</span>
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
