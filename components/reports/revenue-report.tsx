"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

interface RevenueData {
  date: string
  roomRevenue: number
  serviceRevenue: number
  totalRevenue: number
}

export function RevenueReport({ instanceId }: { instanceId: string }) {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instances/${instanceId}/reports/revenue`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch revenue data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading revenue report...</div>
  }

  const totals = data.reduce(
    (acc, row) => ({
      roomRevenue: acc.roomRevenue + row.roomRevenue,
      serviceRevenue: acc.serviceRevenue + row.serviceRevenue,
      totalRevenue: acc.totalRevenue + row.totalRevenue,
    }),
    { roomRevenue: 0, serviceRevenue: 0, totalRevenue: 0 },
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Revenue Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Room Revenue</TableHead>
              <TableHead>Service Revenue</TableHead>
              <TableHead>Total Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(row.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>${row.roomRevenue.toFixed(2)}</TableCell>
                <TableCell>${row.serviceRevenue.toFixed(2)}</TableCell>
                <TableCell className="font-medium">${row.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50 font-semibold">
              <TableCell>Total</TableCell>
              <TableCell>${totals.roomRevenue.toFixed(2)}</TableCell>
              <TableCell>${totals.serviceRevenue.toFixed(2)}</TableCell>
              <TableCell>${totals.totalRevenue.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
