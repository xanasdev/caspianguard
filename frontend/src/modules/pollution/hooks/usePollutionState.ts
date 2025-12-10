import {useState} from 'react'
import {Marker, PollutionStatus} from '../domain/pollution.model'

type Coordinates = [number, number]

type FilterState = {
	status?: PollutionStatus
	type?: string
}

export const usePollutionState = () => {
	const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
	const [reportDialogOpen, setReportDialogOpen] = useState(false)
	const [filtersSheetOpen, setFiltersSheetOpen] = useState(false)
	const [draftCoordinates, setDraftCoordinates] = useState<Coordinates | null>(null)
	const [filters, setFilters] = useState<FilterState>({})

	return {
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
	}
}
