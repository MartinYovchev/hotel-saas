"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DangerZoneProps {
  instanceId: string
}

export function DangerZone({ instanceId }: DangerZoneProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isClearing, setIsClearing] = useState<"reservations" | "statistics" | null>(null)
  const [showReservationsDialog, setShowReservationsDialog] = useState(false)
  const [showStatisticsDialog, setShowStatisticsDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleClearReservations() {
    setIsClearing("reservations")
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/instances/${instanceId}/clear-reservations`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.instance.failedToClear)
        setIsClearing(null)
        return
      }

      setSuccess(t.instance.reservationsCleared)
      router.refresh()
      setIsClearing(null)
    } catch (error) {
      setError(t.auth.errorOccurred)
      setIsClearing(null)
    }
  }

  async function handleClearStatistics() {
    setIsClearing("statistics")
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/instances/${instanceId}/clear-statistics`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || t.instance.failedToClear)
        setIsClearing(null)
        return
      }

      setSuccess(t.instance.statisticsCleared)
      router.refresh()
      setIsClearing(null)
    } catch (error) {
      setError(t.auth.errorOccurred)
      setIsClearing(null)
    }
  }

  return (
    <>
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-900">{t.instance.dangerZone}</CardTitle>
          </div>
          <CardDescription className="text-red-700">{t.instance.dangerZoneDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Clear Statistics Button */}
          <div className="flex items-start justify-between rounded-lg border border-red-200 bg-white p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{t.instance.clearAllStatistics}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.instance.clearAllStatisticsDescription}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowStatisticsDialog(true)}
              disabled={isClearing !== null}
              className="ml-4"
            >
              {isClearing === "statistics" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              {t.common.delete}
            </Button>
          </div>

          {/* Clear Reservations Button */}
          <div className="flex items-start justify-between rounded-lg border border-red-200 bg-white p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{t.instance.clearAllReservations}</h3>
              <p className="mt-1 text-sm text-slate-600">{t.instance.clearAllReservationsDescription}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowReservationsDialog(true)}
              disabled={isClearing !== null}
              className="ml-4"
            >
              {isClearing === "reservations" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              {t.common.delete}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Confirmation Dialog */}
      <AlertDialog open={showStatisticsDialog} onOpenChange={setShowStatisticsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.instance.clearAllStatistics}</AlertDialogTitle>
            <AlertDialogDescription>{t.instance.clearAllStatisticsConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowStatisticsDialog(false)
                handleClearStatistics()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reservations Confirmation Dialog */}
      <AlertDialog open={showReservationsDialog} onOpenChange={setShowReservationsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.instance.clearAllReservations}</AlertDialogTitle>
            <AlertDialogDescription>{t.instance.clearAllReservationsConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowReservationsDialog(false)
                handleClearReservations()
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
