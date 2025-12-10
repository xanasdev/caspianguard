import {Placemark} from '@pbe/react-yandex-maps'
import {Marker} from '../../domain/pollution.model'
import {getMarkerColor} from '../../utils/marker-style'

interface MapMarkersListProps {
	markers: Marker[]
	onMarkerClick: (marker: Marker) => void
}

export const MapMarkersList = ({markers, onMarkerClick}: MapMarkersListProps) => (
	<>
		{markers.map((marker) => (
			<Placemark
				key={marker.id}
				geometry={[Number(marker.latitude), Number(marker.longitude)]}
				options={{preset: 'islands#circleIcon', iconColor: getMarkerColor(marker.pollution_type.name)}}
				onClick={() => onMarkerClick(marker)}
			/>
		))}
	</>
)
