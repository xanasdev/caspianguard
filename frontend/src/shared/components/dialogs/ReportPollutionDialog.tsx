import {ReportForm} from '@/shared/components/pollution/ReportForm'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/Dialog'
import {DEFAULT_MAP_CENTER} from '@/shared/constants/map.constants'
import {PollutionType} from '@/shared/types'
import {MapPin} from 'lucide-react'

interface ReportPollutionDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	coords: [number, number] | null
	onSubmit: (data: {
		type: PollutionType
		description: string
		photos: File[]
		region?: string
	}) => void
	isLoading: boolean
}

export function ReportPollutionDialog({
	open,
	onOpenChange,
	coords,
	onSubmit,
	isLoading,
}: ReportPollutionDialogProps) {
	const reportCoords = coords || DEFAULT_MAP_CENTER

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Report Pollution</DialogTitle>
				</DialogHeader>
				{!coords && (
					<div
						style={{
							padding: '0.75rem',
							background: 'hsl(var(--muted))',
							borderRadius: '0.5rem',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem',
							marginBottom: '1rem',
						}}
					>
						<MapPin className='h-4 w-4 text-blue-500' />
						<p style={{fontSize: '0.875rem', margin: 0}}>
							Using default location. Click on the map to select a specific
							location.
						</p>
					</div>
				)}
				<ReportForm
					latitude={reportCoords[0]}
					longitude={reportCoords[1]}
					onSubmit={onSubmit}
					isLoading={isLoading}
				/>
			</DialogContent>
		</Dialog>
	)
}
