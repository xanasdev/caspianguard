import {MapPin} from 'lucide-react'
import {ReportForm} from '../forms/ReportForm'
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/shared/components/ui/Dialog'
import {DEFAULT_MAP_CENTER} from '@/shared/constants/map.constants'

interface ReportPollutionDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	coords: [number, number] | null
	onSubmit: (data: {
		type: string
		description: string
		photos: File[]
		region?: string
	}) => void
	isLoading: boolean
	error?: string | null
}

export const ReportPollutionDialog = ({
	open,
	onOpenChange,
	coords,
	onSubmit,
	isLoading,
	error,
}: ReportPollutionDialogProps) => {
	const reportCoords = coords ?? DEFAULT_MAP_CENTER

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Сообщить о загрязнении</DialogTitle>
				</DialogHeader>
				{!coords && (
					<div className='flex items-center gap-2 rounded-lg bg-muted px-3 py-2 mb-4'>
						<MapPin className='h-4 w-4 text-blue-500' />
						<p className='text-sm text-muted-foreground'>Используется локация по умолчанию. Кликните на карту для выбора точки.</p>
					</div>
				)}
				<ReportForm
					latitude={reportCoords[0]}
					longitude={reportCoords[1]}
					onSubmit={onSubmit}
					isLoading={isLoading}
					error={error}
				/>
			</DialogContent>
		</Dialog>
	)
}
