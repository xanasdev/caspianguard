
import { PollutionPoint } from '@/shared/types'
import { PollutionMarker } from '@/shared/components/map/PollutionMarker'

interface PollutionListProps {
  points: PollutionPoint[]
  onPointClick: (point: PollutionPoint) => void
}

export function PollutionList({ points, onPointClick }: PollutionListProps) {
  return (
    <>
      {points.map((point) => (
        <PollutionMarker key={point.id} point={point} onClick={onPointClick} />
      ))}
    </>
  )
}
