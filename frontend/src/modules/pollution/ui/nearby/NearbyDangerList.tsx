import {AlertTriangle, MapPin, Navigation, X} from 'lucide-react'
import {Card} from '@/shared/components/ui/Card'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {ScrollArea} from '@/shared/components/ui/ScrollArea'
import {Separator} from '@/shared/components/ui/Separator'
import styles from '@/shared/styles/nearby.module.css'
import {NearbyDangerEmpty} from './NearbyDangerEmpty'
import {NearbyMarker, formatDistance, getDangerLevel} from '../../utils/distance'
import {DANGER_COLORS, DANGER_LABELS} from '@/shared/constants/danger.constants'
import {getMarkerIcon} from '../../utils/marker-style'


interface NearbyDangerListProps {
	markers: NearbyMarker[]
	userLocation: {latitude: number; longitude: number}
	onMarkerClick: (marker: NearbyMarker) => void
	onClose: () => void
}

export const NearbyDangerList = ({
	markers,
	userLocation,
	onMarkerClick,
	onClose,
}: NearbyDangerListProps) => {
	if (markers.length === 0) {
		return <NearbyDangerEmpty onClose={onClose} />
	}

	return (
		<Card className={styles.container}>
			<div className={styles.header}>
				<div className={styles.titleRow}>
					<AlertTriangle className='h-5 w-5 text-red-500' />
					<h3 className={styles.title}>Nearby Pollution</h3>
					<Badge variant='destructive'>{markers.length}</Badge>
				</div>
				<Button variant='ghost' size='sm' onClick={onClose}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className={styles.locationInfo}>
				<MapPin className='h-4 w-4 text-blue-500' />
				<span className={styles.locationText}>
					Your location: {userLocation.latitude.toFixed(4)},{' '}
					{userLocation.longitude.toFixed(4)}
				</span>
			</div>

			<Separator />

			<ScrollArea className={styles.scrollArea}>
				<div className={styles.list}>
					{markers.map((marker, index) => {
						const dangerLevel = getDangerLevel(marker.distance)
						return (
							<div key={marker.id}>
								<div
									className={styles.listItem}
									onClick={() => onMarkerClick(marker)}
									role='button'
									tabIndex={0}
								>
									<div className={styles.itemIcon}>
										<span className={styles.emoji}>{getMarkerIcon(marker.pollution_type.name)}</span>
									</div>
									<div className={styles.itemContent}>
										<div className={styles.itemHeader}>
											<span className={styles.itemTitle}>
												{marker.pollution_type.name.replace(/_/g, ' ')}
											</span>
											<Badge
												variant={DANGER_COLORS[dangerLevel]}
												className={styles.dangerBadge}
											>
												{DANGER_LABELS[dangerLevel]}
											</Badge>
										</div>
										<p className={styles.itemDescription}>
											{marker.description.length > 60
												? `${marker.description.substring(0, 60)}...`
												: marker.description}
										</p>
										<div className={styles.itemFooter}>
											<div className={styles.itemMeta}>
												<Navigation className='h-3 w-3' />
												<span>{formatDistance(marker.distance)} away</span>
											</div>
											<Badge variant='outline' className={styles.statusBadge}>
												{marker.region_type}
											</Badge>
										</div>
									</div>
								</div>
								{index < markers.length - 1 && <Separator />}
							</div>
						)
					})}
				</div>
			</ScrollArea>
		</Card>
	)
}
