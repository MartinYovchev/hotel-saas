"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed } from "lucide-react"
import { EditRoomTypeButton } from "./edit-room-type-button"

interface RoomTypeListProps {
  roomTypes: Array<{
    id: string
    name: string
    description: string | null
    maxGuests: number
    basePrice: any
    amenities: any
    _count: {
      rooms: number
    }
  }>
  instanceId: string
}

export function RoomTypeList({ roomTypes, instanceId }: RoomTypeListProps) {
  if (roomTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white py-12">
        <Bed className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No room types yet</h3>
        <p className="mt-2 text-sm text-slate-600">Create your first room type to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roomTypes.map((roomType) => (
        <Card key={roomType.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{roomType.name}</CardTitle>
              <EditRoomTypeButton roomType={roomType} instanceId={instanceId} />
            </div>
            {roomType.description && <p className="text-sm text-slate-600">{roomType.description}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${Number(roomType.basePrice).toFixed(2)}</span>
              <span className="text-sm text-slate-600">per night</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{roomType.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{roomType._count.rooms} rooms</span>
              </div>
            </div>

            {roomType.amenities && Array.isArray(roomType.amenities) && (
              <div className="flex flex-wrap gap-2">
                {roomType.amenities.slice(0, 3).map((amenity: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
                {roomType.amenities.length > 3 && (
                  <Badge variant="secondary">+{roomType.amenities.length - 3} more</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
