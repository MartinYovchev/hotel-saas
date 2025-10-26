"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed } from "lucide-react"
import { EditRoomButton } from "./edit-room-button"
import { useLanguage } from "@/lib/contexts/language-context"

interface RoomListProps {
  rooms: Array<{
    id: string
    roomNumber: string
    status: string
    floor: number | null
    roomType: {
      id: string
      name: string
      basePrice: any
    }
  }>
  instanceId: string
}

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-800",
  OCCUPIED: "bg-red-100 text-red-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
  CLEANING: "bg-blue-100 text-blue-800",
}

export function RoomList({ rooms, instanceId }: RoomListProps) {
  const { t } = useLanguage()

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return t.rooms.available
      case "OCCUPIED":
        return t.rooms.occupied
      case "MAINTENANCE":
        return t.rooms.maintenance
      default:
        return status
    }
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <Bed className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{t.rooms.noRooms}</h3>
        <p className="mt-2 text-sm text-slate-600">{t.rooms.createRoomDescription}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{t.rooms.roomNumber} {room.roomNumber}</h3>
                  <p className="text-sm text-slate-600">{room.roomType.name}</p>
                </div>
              </div>
              <EditRoomButton room={room} instanceId={instanceId} />
            </div>

            <div className="mt-4 space-y-2">
              <Badge
                className={statusColors[room.status as keyof typeof statusColors] || "bg-slate-100 text-slate-800"}
              >
                {getStatusText(room.status)}
              </Badge>
              {room.floor !== null && <p className="text-sm text-slate-600">{t.rooms.floor} {room.floor}</p>}
              <p className="text-sm font-semibold text-slate-900">
                ${Number(room.roomType.basePrice).toFixed(2)}/{t.rooms.basePrice.split(' (')[0].toLowerCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
