import {Avatar, AvatarFallback} from '@/shared/components/ui/Avatar'
import {format} from 'date-fns'
import {CalendarDays, Clock, MapPin, User as UserIcon} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {Marker} from '../../domain/pollution.model'

interface PointDetailsMetaProps {
	marker: Marker
}

export const PointDetailsMeta = ({marker}: PointDetailsMetaProps) => {
	const t = useTranslations('home.details')
	const reporterName = marker.creator_username?.trim() || t('reportedByUnknown')
	const reporterInitial = reporterName.charAt(0).toUpperCase() || '?'

	return (
		<section className='grid gap-4 rounded-lg border border-dashed border-border/60 bg-background/60 p-4 sm:grid-cols-2'>
			<div className='flex items-start gap-3'>
				<UserIcon className='mt-1 h-4 w-4 text-primary' />
				<div className='space-y-1 text-sm'>
					<p className='font-medium'>{t('reportedBy')}</p>
					<div className='flex items-center gap-2 text-muted-foreground'>
						<Avatar className='h-7 w-7'>
							<AvatarFallback>{reporterInitial}</AvatarFallback>
						</Avatar>
						<span>{reporterName}</span>
					</div>
				</div>
			</div>
			<div className='flex items-start gap-3'>
				<CalendarDays className='mt-1 h-4 w-4 text-primary' />
				<div className='space-y-1 text-sm'>
					<p className='font-medium'>{t('createdAt')}</p>
					<p className='text-muted-foreground'>
						{format(new Date(marker.created_at), 'dd MMM yyyy, HH:mm')}
					</p>
				</div>
			</div>
			<div className='flex items-start gap-3'>
				<MapPin className='mt-1 h-4 w-4 text-primary' />
				<div className='space-y-1 text-sm'>
					<p className='font-medium'>{t('region')}</p>
					<p className='text-muted-foreground'>
						{marker.region_type ?? t('regionUnknown')}
					</p>
				</div>
			</div>
			<div className='flex items-start gap-3'>
				<Clock className='mt-1 h-4 w-4 text-primary' />
				<div className='space-y-1 text-sm'>
					<p className='font-medium'>{t('coordinates')}</p>
					<p className='text-muted-foreground'>
						{Number(marker.latitude).toFixed(4)},{' '}
						{Number(marker.longitude).toFixed(4)}
					</p>
				</div>
			</div>
		</section>
	)
}
