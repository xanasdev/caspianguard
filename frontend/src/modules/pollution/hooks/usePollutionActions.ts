import {toast} from 'sonner'
import {CreateMarkerPayload, Marker, PollutionStatus} from '../domain/pollution.model'

export type ReportPayload = {
	type: string
	description: string
	photos: File[]
	region?: string
}

type UsePollutionReturn = ReturnType<typeof import('./usePollution').usePollution>

interface PollutionActionDeps {
	createMarker: UsePollutionReturn['createMarker']
	deleteMarker: UsePollutionReturn['deleteMarker']
	updateMarker: UsePollutionReturn['updateMarker']
}

interface ActionCallbacks {
	onSuccess?: () => void
	onError?: () => void
}


export const usePollutionActions = ({createMarker, deleteMarker, updateMarker}: PollutionActionDeps) => {
	const submitReport = async (
		coordinates: [number, number] | null,
		data: ReportPayload,
		callbacks?: ActionCallbacks,
	) => {
		if (!coordinates) return

		const payload: CreateMarkerPayload = {
			latitude: coordinates[0].toString(),
			longitude: coordinates[1].toString(),
			description: data.description,
			region_type: data.region,
			pollution_type_name: data.type,
			photos: data.photos,
		}

		createMarker(payload, {
			onSuccess: () => {
				toast.success('Метка успешно создана')
				callbacks?.onSuccess?.()
			},
			onError: () => {
				toast.error('Не удалось создать метку')
				callbacks?.onError?.()
			},
		})
	}

	const deleteReport = (marker: Marker | null, callbacks?: ActionCallbacks) => {
		if (!marker) return
		deleteMarker(marker.id, {
			onSuccess: () => {
				toast.success('Point deleted successfully')
				callbacks?.onSuccess?.()
			},
			onError: () => {
				toast.error('Failed to delete point')
				callbacks?.onError?.()
			},
		})
	}

	const changeStatus = (marker: Marker | null, status: PollutionStatus, callbacks?: ActionCallbacks) => {
		if (!marker) return
		updateMarker(
			{
				id: marker.id,
				payload: {status},
			},
			{
				onSuccess: () => {
					toast.success('Статус метки обновлён')
					callbacks?.onSuccess?.()
				},
				onError: () => {
					toast.error('Не удалось обновить статус')
					callbacks?.onError?.()
				},
			},
		)
	}

	return {
		submitReport,
		deleteReport,
		changeStatus,
	}
}
