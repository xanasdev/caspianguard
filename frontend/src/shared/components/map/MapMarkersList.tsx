import { Placemark } from '@pbe/react-yandex-maps'
import { PollutionPoint } from '@/shared/types'
import { getMarkerColor } from '@/shared/utils/marker.utils'

interface MapMarkersListProps {
  points: PollutionPoint[]
  onMarkerClick: (point: PollutionPoint) => void
}

export function MapMarkersList({ points, onMarkerClick }: MapMarkersListProps) {
  return (
    <>
      {points.map((point) => (
        <Placemark
          key={point.id}
          geometry={[point.latitude, point.longitude]}
          options={{
            preset: 'islands#circleIcon',
            iconColor: getMarkerColor(point.status),
          }}
          onClick={() => onMarkerClick(point)}
        />
      ))}
    </>
  )
}
