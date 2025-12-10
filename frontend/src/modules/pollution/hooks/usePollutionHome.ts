import {useAuth, UserRole} from '@/modules/auth'
import {useGeolocation} from '@/shared/hooks/use-geolocation'
import {YandexMapEvent} from '@/shared/interfaces/map.interface'
import {extractCoordinates} from '@/shared/utils/map.utils'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Marker, PollutionStatus} from '../domain/pollution.model'
import {ReportPollutionFormData} from '../schemas/report.schema'
import {findNearbyMarkers} from '../utils/distance'
import {buildPollutionStats} from '../utils/stats'
import {usePollution} from './usePollution'
import {usePollutionActions} from './usePollutionActions'
import {usePollutionState} from './usePollutionState'

export const usePollutionHome = () => {
	const {user} = useAuth()
	const [nearbyDismissed, setNearbyDismissed] = useState(false)
	const [nearbyAutoHidden, setNearbyAutoHidden] = useState(false)
	const location = useGeolocation()

	const {
		selectedMarker,
		setSelectedMarker,
		reportDialogOpen,
		setReportDialogOpen,
		filtersSheetOpen,
		setFiltersSheetOpen,
		draftCoordinates,
		setDraftCoordinates,
		filters,
		setFilters,
	} = usePollutionState()

	const {
		markers: allMarkers,
		createMarker,
		deleteMarker,
		updateMarker,
		isCreating,
		createError,
		resetCreateError,
	} = usePollution()

	const {submitReport, deleteReport, changeStatus} = usePollutionActions({
		createMarker,
		deleteMarker,
		updateMarker,
	})

	const filteredMarkers = useMemo(() => {
		let next = allMarkers
		if (filters.status) {
			next = next.filter(
				(marker) =>
					(marker.status ?? PollutionStatus.REPORTED) === filters.status,
			)
		}
		if (filters.type) {
			next = next.filter(
				(marker) => marker.pollution_type.name === filters.type,
			)
		}
		return next
	}, [allMarkers, filters.status, filters.type])

	const filteredStats = useMemo(
		() => buildPollutionStats(filteredMarkers),
		[filteredMarkers],
	)

	const nearbyMarkers = useMemo(() => {
		if (!location.latitude || !location.longitude) return []
		return findNearbyMarkers(
			location.latitude,
			location.longitude,
			filteredMarkers,
			50,
		)
	}, [location.latitude, location.longitude, filteredMarkers])

	const overlaysOpen = reportDialogOpen || filtersSheetOpen || !!selectedMarker
	const showNearby =
		nearbyMarkers.length > 0 &&
		!nearbyDismissed &&
		!nearbyAutoHidden &&
		!!location.latitude

	useEffect(() => {
		setNearbyAutoHidden(overlaysOpen)
	}, [overlaysOpen])

	const handleMapClick = useCallback(
		(event: YandexMapEvent) => {
			const coordinates = extractCoordinates(event)
			setDraftCoordinates(coordinates)
			setReportDialogOpen(true)
		},
		[setDraftCoordinates, setReportDialogOpen],
	)

	const handleReportSubmit = useCallback(
		(data: ReportPollutionFormData & {photos: File[]}) => {
			submitReport(draftCoordinates, data, {
				onSuccess: () => {
					setReportDialogOpen(false)
					setDraftCoordinates(null)
				},
			})
		},
		[draftCoordinates, submitReport, setDraftCoordinates, setReportDialogOpen],
	)

	const handleReportDialogChange = useCallback(
		(open: boolean) => {
			setReportDialogOpen(open)
			if (!open) {
				setDraftCoordinates(null)
				resetCreateError()
			}
		},
		[setDraftCoordinates, setReportDialogOpen, resetCreateError],
	)

	// Format error message from API response
	const createErrorMessage = useMemo(() => {
		if (!createError) return null
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const err = createError as any
		if (err.response?.data) {
			const data = err.response.data
			if (typeof data === 'string') return data
			// Handle DRF validation errors format
			const messages = Object.entries(data)
				.map(([field, errors]) => {
					const errorList = Array.isArray(errors) ? errors : [errors]
					return `${field}: ${errorList.join(', ')}`
				})
				.join('; ')
			return messages || 'Произошла ошибка при создании'
		}
		return err.message || 'Произошла ошибка при создании'
	}, [createError])

	const handleDeleteMarker = useCallback(() => {
		deleteReport(selectedMarker, {
			onSuccess: () => setSelectedMarker(null),
		})
	}, [deleteReport, selectedMarker, setSelectedMarker])

	const handleStatusChange = useCallback(
		(status: PollutionStatus) => {
			changeStatus(selectedMarker, status, {
				onSuccess: () => setSelectedMarker(null),
			})
		},
		[changeStatus, selectedMarker, setSelectedMarker],
	)

	const handleDetailsClose = useCallback(
		() => setSelectedMarker(null),
		[setSelectedMarker],
	)

	const handleFilterDrawerChange = useCallback(
		(open: boolean) => {
			setFiltersSheetOpen(open)
		},
		[setFiltersSheetOpen],
	)

	const handleStatusFilterChange = useCallback(
		(status?: PollutionStatus) => {
			setFilters((prev) => ({...prev, status}))
		},
		[setFilters],
	)

	const handleTypeFilterChange = useCallback(
		(type?: string) => {
			setFilters((prev) => ({...prev, type}))
		},
		[setFilters],
	)

	const handleFiltersReset = useCallback(() => setFilters({}), [setFilters])

	const openReportDialog = useCallback(
		() => setReportDialogOpen(true),
		[setReportDialogOpen],
	)
	const openFilterDrawer = useCallback(
		() => setFiltersSheetOpen(true),
		[setFiltersSheetOpen],
	)
	const dismissNearby = useCallback(() => {
		setNearbyDismissed(true)
		setNearbyAutoHidden(false)
	}, [])
	const selectMarker = useCallback(
		(marker: Marker | null) => setSelectedMarker(marker),
		[setSelectedMarker],
	)

	const userRole = user?.role_name as UserRole | undefined
	const userId = user?.id

	return {
		userRole,
		userId,
		location,
		markers: filteredMarkers,
		stats: filteredStats,
		nearbyMarkers,
		showNearby,
		reportDialogOpen,
		filtersSheetOpen,
		filters,
		selectedMarker,
		draftCoordinates,
		isCreating,
		createErrorMessage,
		handleMapClick,
		handleReportSubmit,
		handleReportDialogChange,
		handleDeleteMarker,
		handleStatusChange,
		handleDetailsClose,
		handleFilterDrawerChange,
		handleStatusFilterChange,
		handleTypeFilterChange,
		handleFiltersReset,
		openReportDialog,
		openFilterDrawer,
		dismissNearby,
		selectMarker,
	}
}
