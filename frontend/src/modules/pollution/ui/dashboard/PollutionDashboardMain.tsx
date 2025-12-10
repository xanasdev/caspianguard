import {DashboardLayout} from '@/modules/layout/DashboardLayout'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {DashboardSidebar} from '@/modules/layout/DashboardSidebar'
import {MapWrapper} from '../map/MapWrapper'
import {YandexMapView} from '../map/YandexMapView'
import {MapMarkersList} from '../map/MapMarkersList'
import {NearbyPanel} from '../nearby/NearbyPanel'
import {Marker, PollutionStats} from '../../domain/pollution.model'
import {NearbyMarker} from '../../utils/distance'
import {YandexMapEvent} from '@/shared/interfaces/map.interface'

interface LocationState {
	latitude?: number | null
	longitude?: number | null
}

interface PollutionDashboardMainProps {
	stats?: PollutionStats
	markers: Marker[]
	nearbyMarkers: NearbyMarker[]
	location: LocationState
	showNearby: boolean
	onMapClick: (event: YandexMapEvent) => void
	onMarkerSelect: (marker: Marker) => void
	onNearbyDismiss: () => void
	onRequestReport: () => void
	onRequestFilter: () => void
}

export const PollutionDashboardMain = ({
	stats,
	markers,
	nearbyMarkers,
	location,
	showNearby,
	onMapClick,
	onMarkerSelect,
	onNearbyDismiss,
	onRequestReport,
	onRequestFilter,
}: PollutionDashboardMainProps) => {
	const {latitude, longitude} = location
	const hasLocation = latitude != null && longitude != null

	return (
		<DashboardLayout
			header={<DashboardHeader />}
			sidebar={
				<div className="page-transition-slide">
					<DashboardSidebar
						stats={stats}
						markers={markers}
						onMarkerClick={onMarkerSelect}
						onFilterClick={onRequestFilter}
						onReportClick={onRequestReport}
					/>
				</div>
			}
			map={
				<div className="page-transition h-full">
					<MapWrapper>
						<YandexMapView onMapClick={onMapClick} markers={markers}>
							<MapMarkersList markers={markers} onMarkerClick={onMarkerSelect} />
						</YandexMapView>

						{showNearby && hasLocation && (
							<NearbyPanel
								markers={nearbyMarkers}
								userLocation={{latitude, longitude}}
								onMarkerClick={onMarkerSelect}
								onClose={onNearbyDismiss}
							/>
						)}
					</MapWrapper>
				</div>
			}
		/>
	)
}
