import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader session={session} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
