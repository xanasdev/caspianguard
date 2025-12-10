import {Badge} from '@/shared/components/ui/Badge'
import {getMediaUrl} from '@/shared/utils/media'
import {Camera, Clock, X} from 'lucide-react'
import {useTranslations} from 'next-intl'
import Image from 'next/image'
import {useState} from 'react'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import styles from './point-details.module.css'

const statusStyles: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'bg-red-100 text-red-700 border-red-200',
	[PollutionStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
	[PollutionStatus.CLEANED]:
		'bg-emerald-100 text-emerald-700 border-emerald-200',
	[PollutionStatus.VERIFIED]: 'bg-blue-100 text-blue-700 border-blue-200',
}

interface PointDetailsHeaderProps {
	marker: Marker
}

export const PointDetailsHeader = ({marker}: PointDetailsHeaderProps) => {
	const t = useTranslations('home.details')
	const tStatus = useTranslations('status')
	const photos = marker.photos ?? []
	const featuredPhoto = photos[0]
	const featuredPhotoUrl = getMediaUrl(featuredPhoto?.image)
	const [lightboxOpen, setLightboxOpen] = useState(false)

	return (
		<header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
			<div className='space-y-3'>
				<div className='space-y-1'>
					<p className='text-sm uppercase tracking-wide text-muted-foreground'>
						{t('type')}
					</p>
					<h3 className='text-xl font-semibold capitalize'>
						{marker.pollution_type.name.replace(/_/g, ' ')}
					</h3>
				</div>
				{marker.status && (
					<Badge
						variant='outline'
						className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${
							statusStyles[marker.status]
						}`}
					>
						<Clock className='h-3 w-3' />
						{tStatus(marker.status)}
					</Badge>
				)}
			</div>
			{featuredPhotoUrl ? (
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={() => setLightboxOpen(true)}
						className='overflow-hidden rounded-lg border border-border bg-muted/40 p-1 transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
					>
						<Image
							src={featuredPhotoUrl}
							alt='Фото загрязнения'
							width={160}
							height={160}
							className='h-32 w-32 rounded-md object-cover'
							priority
						/>
					</button>
					{photos.length > 1 && (
						<div className='flex flex-col justify-between rounded-lg border border-dashed border-border/70 bg-muted/10 p-3 text-xs text-muted-foreground'>
							<span className='inline-flex items-center gap-2 font-medium'>
								<Camera className='h-3.5 w-3.5' />
								{t('photos', {count: photos.length})}
							</span>
							<span>{t('viewGallery')}</span>
						</div>
					)}
				</div>
			) : null}
			{lightboxOpen && featuredPhotoUrl && (
				<div className={styles.lightboxOverlay} role='dialog' aria-modal='true'>
					<div className='relative'>
						<button
							type='button'
							onClick={() => setLightboxOpen(false)}
							className='absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20'
						>
							<X className='h-4 w-4' />
						</button>
						<div className={styles.lightboxContent}>
							<Image
								src={featuredPhotoUrl}
								alt='Просмотр фотографии загрязнения'
								width={960}
								height={640}
								className='h-full w-full object-contain bg-black'
							/>
						</div>
					</div>
				</div>
			)}
		</header>
	)
}
