import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { ScrollArea } from '@/shared/components/ui/ScrollArea'
import { Separator } from '@/shared/components/ui/Separator'
import { AlertTriangle, MapPin, Navigation, X } from 'lucide-react'
import { PollutionPoint } from '@/shared/types'
import { NearbyPoint, formatDistance, getDangerLevel } from '@/shared/utils/distance.utils'
import { getMarkerIcon } from '@/shared/utils/marker.utils'
import { filterDangerousPoints } from '@/shared/utils/pollution.utils'
import { DANGER_COLORS, DANGER_LABELS } from '@/shared/constants/danger.constants'
import styles from '@/shared/styles/nearby.module.css'

interface NearbyDangerListProps {
  nearbyPoints: NearbyPoint[]
  userLocation: { latitude: number; longitude: number }
  onPointClick: (point: PollutionPoint) => void
  onClose: () => void
}

export function NearbyDangerList({
  nearbyPoints,
  userLocation,
  onPointClick,
  onClose,
}: NearbyDangerListProps) {
  const dangerousPoints = filterDangerousPoints(nearbyPoints)

  if (dangerousPoints.length === 0) {
    return (
      <Card className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Navigation className="h-5 w-5 text-green-500" />
            <h3 className={styles.title}>Nearby Pollution</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className={styles.emptyState}>
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
          <p className={styles.emptyText}>No pollution points nearby</p>
          <p className={styles.emptySubtext}>Your area is clean! 🌊</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className={styles.title}>Nearby Pollution</h3>
          <Badge variant="destructive">{dangerousPoints.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className={styles.locationInfo}>
        <MapPin className="h-4 w-4 text-blue-500" />
        <span className={styles.locationText}>
          Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
        </span>
      </div>

      <Separator />

      <ScrollArea className={styles.scrollArea}>
        <div className={styles.list}>
          {dangerousPoints.map((point, index) => {
            const dangerLevel = getDangerLevel(point.distance)
            return (
              <div key={point.id}>
                <div
                  className={styles.listItem}
                  onClick={() => onPointClick(point)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.itemIcon}>
                    <span className={styles.emoji}>{getMarkerIcon(point.pollution_type.name)}</span>
                  </div>

                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>
                        {point.pollution_type.name.replace(/_/g, ' ')}
                      </span>
                      <Badge variant={DANGER_COLORS[dangerLevel]} className={styles.dangerBadge}>
                        {DANGER_LABELS[dangerLevel]}
                      </Badge>
                    </div>

                    <p className={styles.itemDescription}>
                      {point.description.length > 60
                        ? `${point.description.substring(0, 60)}...`
                        : point.description}
                    </p>

                    <div className={styles.itemFooter}>
                      <div className={styles.itemMeta}>
                        <Navigation className="h-3 w-3" />
                        <span>{formatDistance(point.distance)} away</span>
                      </div>
                      <Badge variant="outline" className={styles.statusBadge}>
                        {point.region_type}
                      </Badge>
                    </div>
                  </div>
                </div>
                {index < dangerousPoints.length - 1 && <Separator />}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}
