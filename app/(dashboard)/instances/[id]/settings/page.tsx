import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InstanceSettingsForm } from "@/components/instances/instance-settings-form"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function InstanceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  const { id } = await params

  if (!session?.user) {
    redirect("/login")
  }

  const instance = await prisma.instance.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
  })

  if (!instance) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">Manage your property settings and preferences</p>
      </div>

      <InstanceSettingsForm instance={instance} />
    </div>
  )
}
