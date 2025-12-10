import { Placemark } from '@pbe/react-yandex-maps'
import { PollutionPoint } from '@/shared/types'
import { getMarkerColor, getMarkerIcon } from '@/shared/utils/marker.utils'

interface PollutionMarkerProps {
  point: PollutionPoint
  onClick: (point: PollutionPoint) => void
}

export function PollutionMarker({point, onClick}: PollutionMarkerProps) {
	return (
		<Placemark
			geometry={[point.latitude, point.longitude]}
			options={{
				preset: 'islands#circleIcon',
				iconColor: getMarkerColor(point.status),
			}}
			properties={{
				iconContent: getMarkerIcon(point.type),
				balloonContent: `
          <div style="padding: 8px;">
            <strong>${point.type}</strong><br/>
            Status: ${point.status}<br/>
            ${point.description}
          </div>
        `,
			}}
			onClick={() => onClick(point)}
		/>
	)
}
