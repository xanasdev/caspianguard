import {PollutionPoint, PollutionStatus} from '@/shared/types'
import {NearbyPoint} from './distance.utils'

export const filterDangerousPoints = (points: NearbyPoint[]): NearbyPoint[] => {
	return points.filter(
		(p) =>
			p.status === PollutionStatus.REPORTED ||
			p.status === PollutionStatus.IN_PROGRESS,
	)
}

export const isDangerousStatus = (status: PollutionStatus): boolean => {
	return (
		status === PollutionStatus.REPORTED ||
		status === PollutionStatus.IN_PROGRESS
	)
}

export const getSafePoints = (points: PollutionPoint[]): PollutionPoint[] => {
	return points.filter(
		(p) =>
			p.status === PollutionStatus.CLEANED ||
			p.status === PollutionStatus.VERIFIED,
	)
}
