import { MapContainer } from '@/shared/components/map/MapContainer'
import { MapOverlay } from '@/shared/components/map/MapOverlay'
import { MapActions } from '@/shared/components/map/MapActions'
import { PollutionList } from '@/shared/components/pollution/PollutionList'
import { StatsCard } from '@/shared/components/pollution/StatsCard'
import { PollutionPoint, PollutionStats } from '@/shared/types'
import styles from '@/shared/styles/layout.module.css'

interface MapViewProps {
  points: PollutionPoint[]
  stats?: PollutionStats
  onMapClick: (coords: [number, number]) => void
  onPointClick: (point: PollutionPoint) => void
  onReportClick: () => void
  onFilterClick: () => void
}

export function MapView({
  points,
  stats,
  onMapClick,
  onPointClick,
  onReportClick,
  onFilterClick,
}: MapViewProps) {
  return (
    <div className={styles.flexOne}>
      <MapContainer onClick={onMapClick}>
        <PollutionList points={points} onPointClick={onPointClick} />
      </MapContainer>

      <MapOverlay position="top">
        <StatsCard stats={stats} />
      </MapOverlay>

      <MapOverlay position="bottom">
        <MapActions onReportClick={onReportClick} onFilterClick={onFilterClick} />
      </MapOverlay>
    </div>
  )
}
