import { PollutionPoint, PollutionStatus } from '@/shared/types'
import { YandexMapEvent, ReportData } from '@/shared/interfaces/map.interface'
import { extractCoordinates } from '@/shared/utils/map.utils'
import { toast } from 'sonner'

interface UseMapActionsProps {
  setNewPointCoords: (coords: [number, number] | null) => void
  setReportDialogOpen: (open: boolean) => void
  setSelectedPoint: (point: PollutionPoint | null) => void
  createPoint: any
  updatePoint: any
  deletePoint: any
  selectedPoint: PollutionPoint | null
}

export const useMapActions = ({
  setNewPointCoords,
  setReportDialogOpen,
  setSelectedPoint,
  createPoint,
  updatePoint,
  deletePoint,
  selectedPoint,
}: UseMapActionsProps) => {
  const handleMapClick = (e: YandexMapEvent) => {
    const coords = extractCoordinates(e)
    setNewPointCoords(coords)
    setReportDialogOpen(true)
  }

  const handleReportSubmit = (
    newPointCoords: [number, number] | null,
    data: ReportData
  ) => {
    if (!newPointCoords) return
    createPoint(
      {
        latitude: newPointCoords[0].toString(),
        longitude: newPointCoords[1].toString(),
        description: data.description,
        region_type: data.region || 'Unknown',
        pollution_type: {
          name: data.type,
          description: '',
        },
      },
      {
        onSuccess: () => {
          toast.success('Метка успешно создана')
          setReportDialogOpen(false)
          setNewPointCoords(null)
        },
        onError: () => toast.error('Не удалось создать метку'),
      }
    )
  }

  const handleStatusChange = (_status: PollutionStatus) => {
    if (!selectedPoint) return
    toast.info('Обновление статуса не поддерживается')
    setSelectedPoint(null)
  }

  const handleDelete = () => {
    if (!selectedPoint) return
    deletePoint(selectedPoint.id, {
      onSuccess: () => {
        toast.success('Point deleted successfully')
        setSelectedPoint(null)
      },
      onError: () => toast.error('Failed to delete point'),
    })
  }

  return {
    handleMapClick,
    handleReportSubmit,
    handleStatusChange,
    handleDelete,
  }
}
