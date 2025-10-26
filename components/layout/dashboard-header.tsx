"use client"

import type { Session } from "next-auth"
import { UserNav } from "@/components/layout/user-nav"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/contexts/language-context"

interface DashboardHeaderProps {
  session: Session
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h2 className="text-lg font-semibold">{t.dashboard.title}</h2>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <UserNav session={session} />
      </div>
    </header>
  )
}
