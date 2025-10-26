import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OnboardingContent } from "@/components/onboarding/onboarding-content"

export const dynamic = 'force-dynamic'

async function getInstanceCount(userId: string) {
  const { prisma } = await import("@/lib/prisma")
  return await prisma.instance.count({
    where: { userId },
  })
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

  return <OnboardingContent />
}
