import {PollutionPoint, PollutionStatus, PollutionType} from '@/shared/types'
import {ReportFormData} from './components.interface'

export interface GeolocationState {
	latitude: number | null
	longitude: number | null
	error: string | null
	loading: boolean
}

export interface MapState {
	selectedPoint: PollutionPoint | null
	reportDialogOpen: boolean
	filterOpen: boolean
	newPointCoords: [number, number] | null
	filters: MapFilters
}

export interface MapFilters {
	status?: PollutionStatus
	type?: PollutionType
}

export interface UseMapActionsProps {
	setNewPointCoords: (coords: [number, number] | null) => void
	setReportDialogOpen: (open: boolean) => void
	setSelectedPoint: (point: PollutionPoint | null) => void
	createPoint: CreatePointMutation
	updatePoint: UpdatePointMutation
	deletePoint: DeletePointMutation
	selectedPoint: PollutionPoint | null
}

export interface MapHandlers {
	handleMapClick: (e: YandexMapEvent) => void
	handleReportSubmit: (
		coords: [number, number] | null,
		data: ReportFormData,
	) => void
	handleStatusChange: (status: PollutionStatus) => void
	handleDelete: () => void
}

export interface YandexMapEvent {
	get: (key: string) => unknown
}

export type CreatePointMutation = (
	data: CreatePointData,
	options?: MutationOptions,
) => void

export type UpdatePointMutation = (
	data: UpdatePointData,
	options?: MutationOptions,
) => void

export type DeletePointMutation = (
	id: string,
	options?: MutationOptions,
) => void

export interface CreatePointData {
	latitude: number
	longitude: number
	type: PollutionType
	description: string
	photos: File[]
	region?: string
}

export interface UpdatePointData {
	id: string
	data: Partial<PollutionPoint>
}

export interface MutationOptions {
	onSuccess?: () => void
	onError?: () => void
}
