import { PollutionPoint } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { MapPin } from 'lucide-react'
import styles from '@/shared/styles/dashboard.module.css'

interface PollutionCardProps {
  point: PollutionPoint
  onStatusChange?: (id: number) => void
}

export function PollutionCard({ point }: PollutionCardProps) {
  return (
    <Card className={styles.pointCard}>
      <div className={styles.pointHeader}>
        <div className={styles.pointContent}>
          <div className={styles.badgeGroup}>
            <Badge>{point.pollution_type.name}</Badge>
            <Badge variant="outline">{point.region_type}</Badge>
          </div>
          <p className={styles.pointDescription}>{point.description}</p>
          <div className={styles.pointMeta}>
            <MapPin className="h-4 w-4" />
            <span>
              {point.latitude}, {point.longitude}
            </span>
          </div>
          <div className={styles.pointDate}>
            {new Date(point.created_at).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>
    </Card>
  )
}
