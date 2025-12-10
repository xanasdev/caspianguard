import {ReactNode} from 'react'
import {Map} from '@pbe/react-yandex-maps'
import {YandexMapEvent} from '@/shared/interfaces/map.interface'
import {DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM} from '@/shared/constants/map.constants'
import {Marker} from '../../domain/pollution.model'
import {PollutionHeatZones} from './PollutionHeatZones'

interface YandexMapViewProps {
	children: ReactNode
	onMapClick: (event: YandexMapEvent) => void
 	markers?: Marker[]
}

export const YandexMapView = ({children, onMapClick, markers = []}: YandexMapViewProps) => (
	<Map
		defaultState={{center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM}}
		width='100%'
		height='100%'
		onClick={onMapClick}
	>
		{children}
 		<PollutionHeatZones markers={markers} />
	</Map>
)
