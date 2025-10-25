import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InstanceList } from "@/components/instances/instance-list"
import { CreateInstanceButton } from "@/components/instances/create-instance-button"
import { Building2 } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const instances = await prisma.instance.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rooms: true,
          reservations: true,
        },
      },
    },
  })

  // If no instances, redirect to onboarding
  if (instances.length === 0) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Properties</h1>
              <p className="mt-1 text-sm text-slate-600">Manage your hotels and guest houses</p>
            </div>
            <CreateInstanceButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {instances.length > 0 ? (
          <InstanceList instances={instances} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
            <Building2 className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No properties yet</h3>
            <p className="mt-2 text-sm text-slate-600">Get started by creating your first property</p>
            <div className="mt-6">
              <CreateInstanceButton />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
