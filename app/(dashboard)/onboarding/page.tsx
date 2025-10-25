import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export const dynamic = 'force-dynamic'

const isPreviewMode = !process.env.NEON_NEON_DATABASE_URL || process.env.NEON_DATABASE_URL?.includes("placeholder")

async function getInstanceCount(userId: string) {
  if (isPreviewMode) {
    console.log("[v0] Preview mode - skipping instance count check")
    return 0
  }

  try {
    const { prisma } = await import("@/lib/prisma")
    return await prisma.instance.count({
      where: { userId },
    })
  } catch (error) {
    console.log("[v0] Database error in onboarding:", error)
    return 0
  }
}

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  // Check if user already has instances
  const instanceCount = await getInstanceCount(session.user.id)

  if (instanceCount > 0) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome to Hotel SaaS</h1>
          <p className="mt-4 text-lg text-slate-600">Let's set up your first property to get started</p>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
}
