import { useState } from 'react'
import { PollutionPoint, PollutionStatus, PollutionType } from '@/shared/types'

export const useMapState = () => {
  const [selectedPoint, setSelectedPoint] = useState<PollutionPoint | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [newPointCoords, setNewPointCoords] = useState<[number, number] | null>(null)
  const [filters, setFilters] = useState<{
    status?: PollutionStatus
    type?: PollutionType
  }>({})

  return {
    selectedPoint,
    setSelectedPoint,
    reportDialogOpen,
    setReportDialogOpen,
    filterOpen,
    setFilterOpen,
    newPointCoords,
    setNewPointCoords,
    filters,
    setFilters,
  }
}
