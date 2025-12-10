import {useState} from 'react'
import {toast} from 'sonner'
import {PollutionStatus, PollutionType} from '@/modules/pollution/domain/pollution.model'
import {usePollution} from '@/modules/pollution/hooks/usePollution'
import {Marker} from '@/modules/pollution/domain/pollution.model'

interface ReportData {
	type: PollutionType
	description: string
	photos: File[]
	region?: string
}

export const useMapHandlers = () => {
	const [selectedPoint, setSelectedPoint] = useState<Marker | null>(null)
	const [reportDialogOpen, setReportDialogOpen] = useState(false)
	const [filterOpen, setFilterOpen] = useState(false)
	const [newPointCoords, setNewPointCoords] = useState<[number, number] | null>(null)
	const [filters, setFilters] = useState<{
		status?: PollutionStatus
		type?: PollutionType
	}>({})

	const {markers, stats, createMarker, deleteMarker, isCreating} = usePollution(filters)

	const handleMapClick = (coords: [number, number]) => {
		setNewPointCoords(coords)
		setReportDialogOpen(true)
	}

	const handleReportSubmit = (data: ReportData) => {
		if (!newPointCoords) return

		createMarker(
			{
				latitude: newPointCoords[0].toString(),
				longitude: newPointCoords[1].toString(),
				description: data.description,
				region_type: data.region,
				pollution_type_name: data.type,
				photos: data.photos,
			},
			{
				onSuccess: () => {
					toast.success('Метка успешно создана')
					setReportDialogOpen(false)
					setNewPointCoords(null)
				},
				onError: () => {
					toast.error('Не удалось создать метку')
				},
			},
		)
	}

	const handleStatusChange = () => {
		if (!selectedPoint) return
		toast.info('Обновление статуса не поддерживается')
		setSelectedPoint(null)
	}

	const handleDelete = () => {
		if (!selectedPoint) return

		deleteMarker(selectedPoint.id, {
			onSuccess: () => {
				toast.success('Point deleted successfully')
				setSelectedPoint(null)
			},
			onError: () => {
				toast.error('Failed to delete point')
			},
		})
	}

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
		points: markers,
		stats,
		isCreating,
		handleMapClick,
		handleReportSubmit,
		handleStatusChange,
		handleDelete,
	}
}
