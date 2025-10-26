import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { RoomManagement } from "@/components/rooms/room-management"
import { serializePrismaData } from "@/lib/serialize"

export const dynamic = 'force-dynamic'

export default async function RoomsPage({
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

  const roomTypes = await prisma.roomType.findMany({
    where: { instanceId: id },
    include: {
      _count: {
        select: { rooms: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const rooms = await prisma.room.findMany({
    where: { instanceId: id },
    include: {
      roomType: true,
    },
    orderBy: { roomNumber: "asc" },
  })

  return (
    <RoomManagement
      instance={serializePrismaData(instance)}
      roomTypes={serializePrismaData(roomTypes)}
      rooms={serializePrismaData(rooms)}
    />
  )
}
