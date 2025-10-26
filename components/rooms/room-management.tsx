"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { RoomTypeList } from "./room-type-list"
import { RoomList } from "./room-list"
import { CreateRoomTypeButton } from "./create-room-type-button"
import { CreateRoomButton } from "./create-room-button"
import { useLanguage } from "@/lib/contexts/language-context"

interface RoomManagementProps {
  instance: {
    id: string
    name: string
  }
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
}

export function RoomManagement({ instance, roomTypes, rooms }: RoomManagementProps) {
  const [activeTab, setActiveTab] = useState("types")
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href={`/instances/${instance.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{t.rooms.roomManagement}</h1>
              <p className="mt-1 text-sm text-slate-600">{instance.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="types">{t.rooms.roomTypes}</TabsTrigger>
              <TabsTrigger value="rooms">{t.rooms.rooms}</TabsTrigger>
            </TabsList>
            {activeTab === "types" ? (
              <CreateRoomTypeButton instanceId={instance.id} />
            ) : (
              <CreateRoomButton instanceId={instance.id} roomTypes={roomTypes} />
            )}
          </div>

          <TabsContent value="types" className="mt-6">
            <RoomTypeList roomTypes={roomTypes} instanceId={instance.id} />
          </TabsContent>

          <TabsContent value="rooms" className="mt-6">
            <RoomList rooms={rooms} instanceId={instance.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
