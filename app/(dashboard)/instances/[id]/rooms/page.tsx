import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { RoomManagement } from "@/components/rooms/room-management"

export default async function RoomsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const instance = await prisma.instance.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!instance) {
    notFound()
  }

  const roomTypes = await prisma.roomType.findMany({
    where: { instanceId: params.id },
    include: {
      _count: {
        select: { rooms: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const rooms = await prisma.room.findMany({
    where: { instanceId: params.id },
    include: {
      roomType: true,
    },
    orderBy: { roomNumber: "asc" },
  })

  return <RoomManagement instance={instance} roomTypes={roomTypes} rooms={rooms} />
}
