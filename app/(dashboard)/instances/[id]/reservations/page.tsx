import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReservationManagement } from "@/components/reservations/reservation-management"

export const dynamic = 'force-dynamic'

export default async function ReservationsPage({
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

  const reservations = await prisma.reservation.findMany({
    where: { instanceId: id },
    include: {
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: { checkIn: "desc" },
  })

  const rooms = await prisma.room.findMany({
    where: { instanceId: id },
    include: {
      roomType: true,
    },
    orderBy: { roomNumber: "asc" },
  })

  return <ReservationManagement instance={instance} reservations={reservations} rooms={rooms} />
}
