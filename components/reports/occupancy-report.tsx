"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface OccupancyData {
  date: string
  totalRooms: number
  occupiedRooms: number
  occupancyRate: number
}

export function OccupancyReport({ instanceId }: { instanceId: string }) {
  const [data, setData] = useState<OccupancyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOccupancyData()
  }, [])

  const fetchOccupancyData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instances/${instanceId}/reports/occupancy`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch occupancy data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading occupancy report...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Occupancy Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Rooms</TableHead>
              <TableHead>Occupied Rooms</TableHead>
              <TableHead>Occupancy Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(row.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{row.totalRooms}</TableCell>
                <TableCell>{row.occupiedRooms}</TableCell>
                <TableCell>{row.occupancyRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
