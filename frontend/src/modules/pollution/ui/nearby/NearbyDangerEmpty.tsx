import {AlertTriangle, X} from 'lucide-react'
import {Card} from '@/shared/components/ui/Card'
import {Button} from '@/shared/components/ui/Button'
import styles from '@/shared/styles/nearby.module.css'

interface NearbyDangerEmptyProps {
	onClose: () => void
}

export const NearbyDangerEmpty = ({onClose}: NearbyDangerEmptyProps) => (
	<Card className={styles.container}>
		<div className={styles.header}>
			<div className={styles.titleRow}>
				<AlertTriangle className='h-5 w-5 text-green-500' />
				<h3 className={styles.title}>Nearby Pollution</h3>
			</div>
			<Button variant='ghost' size='sm' onClick={onClose}>
				<X className='h-4 w-4' />
			</Button>
		</div>
		<div className={styles.emptyState}>
			<AlertTriangle className='h-12 w-12 text-muted-foreground mb-2' />
			<p className={styles.emptyText}>No pollution points nearby</p>
			<p className={styles.emptySubtext}>Your area is clean! 🌊</p>
		</div>
	</Card>
)
