import { ReactNode } from 'react'
import { PollutionPoint, PollutionStatus, PollutionType, UserRole } from '@/shared/types'
import type { NearbyPoint as NearbyPointType } from '@/shared/utils/distance.utils'

export interface MapWrapperProps {
	children: ReactNode
}

export interface YandexMapViewProps {
	children: ReactNode
	onMapClick: (e: YandexMapEvent) => void
}

export interface MapMarkersListProps {
	points: PollutionPoint[]
	onMarkerClick: (point: PollutionPoint) => void
}

export interface YandexMapEvent {
	get: (key: string) => unknown
}

export interface StatsOverlayProps {
	stats?: PollutionStats
}

export interface PollutionStats {
	total: number
	reported: number
	inProgress: number
	cleaned: number
	verified?: number
}

export interface MapActionButtonsProps {
	onFilterClick: () => void
	onReportClick: () => void
}

export interface ReportPollutionDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	coords: [number, number] | null
	onSubmit: (data: ReportFormData) => void
	isLoading: boolean
}

export interface ReportFormData {
	type: PollutionType
	description: string
	photos: File[]
	region?: string
}

export interface PointDetailsDrawerProps {
	point: PollutionPoint | null
	userRole?: UserRole
	onClose: () => void
	onStatusChange: (status: PollutionStatus) => void
	onDelete: () => void
}

export interface FilterDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	status?: PollutionStatus
	type?: PollutionType
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: PollutionType) => void
	onReset: () => void
}

export interface MapInstructionsProps {
	onClose: () => void
}

export interface HelpButtonProps {
	onClick: () => void
}

export interface NearbyDangerListProps {
	nearbyPoints: NearbyPointType[]
	userLocation: UserLocation
	onPointClick: (point: PollutionPoint) => void
	onClose: () => void
}

export type NearbyPoint = NearbyPointType

export interface UserLocation {
	latitude: number
	longitude: number
}

export interface PollutionMarkerProps {
  point: PollutionPoint
  onClick: (point: PollutionPoint) => void
}

export interface PointDetailsProps {
  point: PollutionPoint
  userRole?: UserRole
  onStatusChange: (status: PollutionStatus) => void
  onDelete: () => void
}

export interface FilterPanelProps {
  status?: PollutionStatus
  type?: PollutionType
  onStatusChange: (status?: PollutionStatus) => void
  onTypeChange: (type?: PollutionType) => void
  onReset: () => void
}

export interface ReportFormProps {
  latitude: number
  longitude: number
  onSubmit: (data: ReportFormData) => void
  isLoading?: boolean
}

export interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export interface AuthFooterProps {
  text: string
  linkText: string
  linkHref: string
}
