import {UserRole} from '@/modules/auth'
import {Button} from '@/shared/components/ui/Button'
import {Card} from '@/shared/components/ui/Card'
import {Clock, MapPin, Trash2} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {PointDetailsDescription} from './PointDetailsDescription'
import {PointDetailsHeader} from './PointDetailsHeader'
import {PointDetailsMeta} from './PointDetailsMeta'

interface PointDetailsProps {
	marker: Marker
	userRole?: UserRole
	userId?: number
	onStatusChange?: (status: PollutionStatus) => void
	onDelete?: () => void
}

export const PointDetails = ({
	marker,
	userRole,
	userId,
	onStatusChange,
	onDelete,
}: PointDetailsProps) => {
	const t = useTranslations('home.details')
	const canManage =
		userRole === UserRole.ACTIVIST || userRole === UserRole.ADMIN
	const canDelete =
		userRole === UserRole.ADMIN || (userId && marker.creator === userId)

	return (
		<Card className='space-y-6 p-6 shadow-sm'>
			<PointDetailsHeader marker={marker} />
			<PointDetailsDescription description={marker.description} />
			<PointDetailsMeta marker={marker} />

			{canManage && (
				<section className='space-y-3 border-t border-border pt-4'>
					<h4 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
						{t('actionsTitle')}
					</h4>
					<div className='flex flex-wrap gap-2'>
						{marker.status !== PollutionStatus.IN_PROGRESS &&
							onStatusChange && (
								<Button
									variant='outline'
									size='sm'
									onClick={() => onStatusChange(PollutionStatus.IN_PROGRESS)}
								>
									<Clock className='mr-2 h-4 w-4' />
									{t('setInProgress')}
								</Button>
							)}
						{marker.status !== PollutionStatus.CLEANED && onStatusChange && (
							<Button
								variant='outline'
								size='sm'
								onClick={() => onStatusChange(PollutionStatus.CLEANED)}
							>
								<MapPin className='mr-2 h-4 w-4' />
								{t('markCleaned')}
							</Button>
						)}
						{canDelete && onDelete && (
							<Button variant='destructive' size='sm' onClick={onDelete}>
								<Trash2 className='mr-2 h-4 w-4' />
								{t('delete')}
							</Button>
						)}
					</div>
				</section>
			)}
		</Card>
	)
}
