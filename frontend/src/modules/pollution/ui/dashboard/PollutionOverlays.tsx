import {UserRole} from '@/modules/auth'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {ReportPollutionFormData} from '../../schemas/report.schema'
import {PointDetailsDrawer} from '../details/PointDetailsDrawer'
import {ReportPollutionDialog} from '../dialogs/ReportPollutionDialog'
import {FilterDrawer} from '../filter/FilterDrawer'

interface FilterState {
	status?: PollutionStatus
	type?: string
}

interface PollutionOverlaysProps {
	reportDialogOpen: boolean
	onReportDialogChange: (open: boolean) => void
	draftCoordinates: [number, number] | null
	onReportSubmit: (data: ReportPollutionFormData & {photos: File[]}) => void
	isCreating: boolean
	createError?: string | null
	selectedMarker: Marker | null
	userRole?: UserRole
	userId?: number
	onDetailsClose: () => void
	onStatusChange: (status: PollutionStatus) => void
	onDeleteMarker: () => void
	filtersOpen: boolean
	onFiltersOpenChange: (open: boolean) => void
	filters: FilterState
	onStatusFilterChange: (status?: PollutionStatus) => void
	onTypeFilterChange: (type?: string) => void
	onFiltersReset: () => void
}

export const PollutionOverlays = ({
	reportDialogOpen,
	onReportDialogChange,
	draftCoordinates,
	onReportSubmit,
	isCreating,
	createError,
	selectedMarker,
	userRole,
	userId,
	onDetailsClose,
	onStatusChange,
	onDeleteMarker,
	filtersOpen,
	onFiltersOpenChange,
	filters,
	onStatusFilterChange,
	onTypeFilterChange,
	onFiltersReset,
}: PollutionOverlaysProps) => (
	<>
		<ReportPollutionDialog
			open={reportDialogOpen}
			onOpenChange={onReportDialogChange}
			coords={draftCoordinates}
			onSubmit={onReportSubmit}
			isLoading={isCreating}
			error={createError}
		/>
		<PointDetailsDrawer
			marker={selectedMarker}
			userRole={userRole}
			userId={userId}
			onClose={onDetailsClose}
			onStatusChange={onStatusChange}
			onDelete={onDeleteMarker}
		/>{' '}
		<FilterDrawer
			open={filtersOpen}
			onOpenChange={onFiltersOpenChange}
			status={filters.status}
			type={filters.type}
			onStatusChange={onStatusFilterChange}
			onTypeChange={onTypeFilterChange}
			onReset={onFiltersReset}
		/>
	</>
)
