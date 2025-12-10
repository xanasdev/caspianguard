import {useMemo} from 'react'
import {Circle} from '@pbe/react-yandex-maps'
import {Marker} from '../../domain/pollution.model'

interface PollutionHeatZonesProps {
	markers: Marker[]
}

type Zone = {
	center: [number, number]
	count: number
}

const intensityColor = (count: number) => {
	if (count >= 7) return 'rgba(239,68,68,0.35)'
	if (count >= 4) return 'rgba(250,204,21,0.3)'
	return 'rgba(34,197,94,0.28)'
}

const strokeColor = (count: number) => {
	if (count >= 7) return '#ef4444'
	if (count >= 4) return '#facc15'
	return '#22c55e'
}

const zoneRadius = (count: number) => 350 + count * 80

const getZoneKey = (marker: Marker) => {
	if (marker.region_type) return marker.region_type
	const lat = Number(marker.latitude)
	const lon = Number(marker.longitude)
	return `${lat.toFixed(2)}_${lon.toFixed(2)}`
}

export const PollutionHeatZones = ({markers}: PollutionHeatZonesProps) => {
	const zones = useMemo<Zone[]>(() => {
		const groups = new Map<string, {count: number; latSum: number; lonSum: number}>()
		markers.forEach((marker) => {
			const key = getZoneKey(marker)
			const lat = Number(marker.latitude)
			const lon = Number(marker.longitude)
			if (!Number.isFinite(lat) || !Number.isFinite(lon)) return
			const group = groups.get(key)
			if (group) {
				group.count += 1
				group.latSum += lat
				group.lonSum += lon
			} else {
				groups.set(key, {count: 1, latSum: lat, lonSum: lon})
			}
		})
		return Array.from(groups.values()).map((group) => ({
			center: [group.latSum / group.count, group.lonSum / group.count] as [number, number],
			count: group.count,
		}))
	}, [markers])

	return zones.map((zone, index) => (
		<Circle
			key={index}
			geometry={[zone.center, zoneRadius(zone.count)]}
			options={{
				fillColor: intensityColor(zone.count),
				strokeColor: strokeColor(zone.count),
				strokeWidth: 2,
				strokeOpacity: 0.6,
			}}
		/>
	))
}
