import {Marker, PollutionStats, PollutionStatus} from '../domain/pollution.model'

const initialStats: PollutionStats = {
	total: 0,
	reported: 0,
	inProgress: 0,
	cleaned: 0,
	byType: {},
	byRegion: {},
}

export const buildPollutionStats = (markers: Marker[]): PollutionStats => {
	return markers.reduce((stats, marker) => {
		stats.total += 1
		const status = marker.status ?? PollutionStatus.REPORTED
		switch (status) {
			case PollutionStatus.IN_PROGRESS:
				stats.inProgress += 1
				break
			case PollutionStatus.CLEANED:
				stats.cleaned += 1
				break
			default:
				stats.reported += 1
		}

		const typeKey = marker.pollution_type.name
		stats.byType[typeKey] = (stats.byType[typeKey] ?? 0) + 1

		const regionKey = marker.region_type ?? 'Не указан'
		stats.byRegion[regionKey] = (stats.byRegion[regionKey] ?? 0) + 1

		return stats
	}, {...initialStats})
}
