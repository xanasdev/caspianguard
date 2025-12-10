import {Marker} from '../domain/pollution.model'

const HEADERS = ['ID', 'Latitude', 'Longitude', 'Type', 'Region', 'Description', 'Created']

export const markersToCSV = (markers: Marker[]): string => {
	const rows = markers.map((marker) => [
		marker.id,
		marker.latitude,
		marker.longitude,
		marker.pollution_type.name,
		marker.region_type,
		marker.description,
		marker.created_at,
	])

	return [HEADERS, ...rows].map((row) => row.join(',')).join('\n')
}
