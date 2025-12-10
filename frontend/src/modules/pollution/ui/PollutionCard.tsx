import {Card} from '@/shared/components/ui/Card'
import {Badge} from '@/shared/components/ui/Badge'
import {MapPin} from 'lucide-react'
import {Marker} from '../domain/pollution.model'
import styles from '@/shared/styles/dashboard.module.css'

interface PollutionCardProps {
	marker: Marker
}

export const PollutionCard = ({marker}: PollutionCardProps) => (
	<Card className={styles.pointCard}>
		<div className={styles.pointHeader}>
			<div className={styles.pointContent}>
				<div className={styles.badgeGroup}>
					<Badge>{marker.pollution_type.name}</Badge>
					<Badge variant='outline'>{marker.region_type}</Badge>
				</div>
				<p className={styles.pointDescription}>{marker.description}</p>
				<div className={styles.pointMeta}>
					<MapPin className='h-4 w-4' />
					<span>
						{marker.latitude}, {marker.longitude}
					</span>
				</div>
				<div className={styles.pointDate}>
					{new Date(marker.created_at).toLocaleDateString('ru-RU')}
				</div>
			</div>
		</div>
	</Card>
)
