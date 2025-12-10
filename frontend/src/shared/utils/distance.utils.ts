import {PollutionPoint} from '@/shared/types'

export interface NearbyPoint extends PollutionPoint {
  distance: number
}

export const calculateDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number => {
	const R = 6371
	const dLat = toRad(lat2 - lat1)
	const dLon = toRad(lon2 - lon1)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	return R * c
}

const toRad = (degrees: number): number => {
	return (degrees * Math.PI) / 180
}

export const formatDistance = (km: number): string => {
	if (km < 1) {
		return `${Math.round(km * 1000)}m`
	}
	return `${km.toFixed(1)}km`
}

export const findNearbyPoints = (
	userLat: number,
	userLon: number,
	points: PollutionPoint[],
	maxDistance: number = 50, // km
): NearbyPoint[] => {
	return points
		.map((point) => ({
			...point,
			distance: calculateDistance(
				userLat,
				userLon,
				point.latitude,
				point.longitude,
			),
		}))
		.filter((point) => point.distance <= maxDistance)
		.sort((a, b) => a.distance - b.distance)
}

export const getDangerLevel = (distance: number): 'high' | 'medium' | 'low' => {
	if (distance < 5) return 'high'
	if (distance < 15) return 'medium'
	return 'low'
}
