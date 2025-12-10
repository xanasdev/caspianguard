import Image from 'next/image'
import {Camera, ImageOff} from 'lucide-react'
import {getMediaUrl} from '@/shared/utils/media'
import {MarkerPhoto} from '../../domain/pollution.model'

interface PointDetailsGalleryProps {
	photos?: MarkerPhoto[]
}

export const PointDetailsGallery = ({photos}: PointDetailsGalleryProps) => {
	const normalized = (photos ?? []).map((photo) => ({
		...photo,
		url: getMediaUrl(photo.image),
	}))

	if (normalized.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground'>
				<ImageOff className='h-6 w-6' />
				<span>Фото не добавлены. Добавьте фотографии, чтобы активисты могли быстрее среагировать.</span>
			</div>
		)
	}

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground'>
				<span className='inline-flex items-center gap-2 font-semibold'>
					<Camera className='h-3.5 w-3.5' />
					Галерея снимков
				</span>
				<span>{normalized.length} фото</span>
			</div>
			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
				{normalized.map((photo) =>
					photo.url ? (
						<div key={photo.id} className='overflow-hidden rounded-lg border border-border bg-muted/40'>
							<Image
								src={photo.url}
								alt='Фото загрязнения'
								width={240}
								height={240}
								className='h-32 w-full object-cover'
							/>
						</div>
					) : (
						<div key={photo.id} className='flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground'>
							<ImageOff className='mr-2 h-4 w-4' />
							Нет превью
						</div>
					),
				)}
			</div>
		</div>
	)
}
