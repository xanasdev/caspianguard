import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {ScrollArea} from '@/shared/components/ui/ScrollArea'
import {DANGER_COLORS, DANGER_LABELS} from '@/shared/constants/danger.constants'
import styles from '@/shared/styles/nearby-panel.module.css'
import {AlertTriangle, MapPin, Navigation, X} from 'lucide-react'
import {
	NearbyMarker,
	formatDistance,
	getDangerLevel,
} from '../../utils/distance'
import {getMarkerIcon} from '../../utils/marker-style'
import {useTranslations} from 'next-intl'

interface NearbyPanelProps {
	markers: NearbyMarker[]
	userLocation: {latitude: number; longitude: number}
	onMarkerClick: (marker: NearbyMarker) => void
	onClose: () => void
}

export const NearbyPanel = ({
	markers,
	userLocation,
	onMarkerClick,
	onClose,
}: NearbyPanelProps) => {
	const t = useTranslations('home.nearby')
	const tType = useTranslations('pollutionType')
	const tRisk = useTranslations('home.nearby.risk')

	const formatRiskLabel = (level: keyof typeof DANGER_LABELS) => tRisk(level)

	if (markers.length === 0) {
		return (
			<section className={styles.panel}>
				<header className={styles.header}>
					<div className={styles.headerTitle}>
						<AlertTriangle className='h-5 w-5 text-emerald-300' />
						<span>{t('title')}</span>
					</div>
					<Button
						variant='ghost'
						size='sm'
						className={styles.closeButton}
						onClick={onClose}
					>
						<X className='h-4 w-4' />
					</Button>
				</header>
				<div className={styles.emptyState}>
					<AlertTriangle className='h-10 w-10 text-emerald-400 opacity-80' />
					<p>{t('empty')}</p>
					<div className={styles.emptyActions}>
						<span>{t('emptyHint')}</span>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className={styles.panel}>
			<header className={styles.header}>
				<div className={styles.headerTitle}>
					<AlertTriangle className='h-5 w-5 text-amber-300' />
					<span>{t('title')}</span>
					<Badge variant='destructive'>{markers.length}</Badge>
				</div>
				<Button
					variant='ghost'
					size='sm'
					className={styles.closeButton}
					onClick={onClose}
				>
					<X className='h-4 w-4' />
				</Button>
			</header>

			<div className={styles.location}>
				<MapPin className='h-4 w-4' />
				<span>
					{userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
				</span>
			</div>

			<ScrollArea className={styles.scrollArea}>
				<div className={styles.list}>
					{markers.map((marker) => {
						const dangerLevel = getDangerLevel(marker.distance)
						return (
							<button
								key={marker.id}
								type='button'
								onClick={() => onMarkerClick(marker)}
								className={styles.item}
							>
								<div className={styles.itemIcon}>
									{getMarkerIcon(marker.pollution_type.name)}
								</div>
								<div className={styles.itemContent}>
									<div className={styles.itemHeader}>
										<span className={styles.itemTitle}>
											{tType(marker.pollution_type.name as never)}
										</span>
										<Badge variant={DANGER_COLORS[dangerLevel]}>
											{formatRiskLabel(dangerLevel)}
										</Badge>
									</div>
									<p className={styles.itemDescription}>
										{marker.description.length > 80
											? `${marker.description.substring(0, 80)}...`
											: marker.description}
									</p>
									<div className={styles.itemFooter}>
										<div className={styles.meta}>
											<Navigation className='h-3 w-3' />
											<span>{formatDistance(marker.distance)}</span>
										</div>
										<Badge variant='outline'>{marker.region_type}</Badge>
									</div>
								</div>
							</button>
						)
					})}
				</div>
			</ScrollArea>
		</section>
	)
}
