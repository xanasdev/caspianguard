import {Marker} from '../domain/pollution.model'

export interface NearbyMarker extends Marker {
	distance: number
}

const EARTH_RADIUS = 6371

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
	const dLat = toRadians(lat2 - lat1)
	const dLon = toRadians(lon2 - lon1)
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	return EARTH_RADIUS * c
}

export const formatDistance = (km: number) => (km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`)

export const getDangerLevel = (distance: number): 'high' | 'medium' | 'low' => {
	if (distance < 5) return 'high'
	if (distance < 15) return 'medium'
	return 'low'
}

export const findNearbyMarkers = (
	latitude: number,
	longitude: number,
	markers: Marker[],
	maxDistance = 50,
): NearbyMarker[] =>
	markers
		.map((marker) => {
			const markerLat = Number(marker.latitude)
			const markerLon = Number(marker.longitude)
			const distance = calculateDistance(latitude, longitude, markerLat, markerLon)
			return {...marker, distance}
		})
		.filter((marker) => marker.distance <= maxDistance)
		.sort((a, b) => a.distance - b.distance)
