import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {pollutionApi} from '../api/pollution.api'
import {CreateMarkerPayload, Marker, MarkerFilters, PollutionStatus, PollutionStats, UpdateMarkerPayload} from '../domain/pollution.model'

interface UsePollutionParams extends MarkerFilters {
	status?: PollutionStatus
	type?: string
}

type CreateMarkerVariables = CreateMarkerPayload

interface UpdateMarkerVariables {
	id: number
	payload: Partial<UpdateMarkerPayload>
}

export const usePollution = (params?: UsePollutionParams) => {
	const queryClient = useQueryClient()

	const {data: markers = [], isLoading} = useQuery<Marker[]>({
		queryKey: ['pollution', params],
		queryFn: () => pollutionApi.getAll(params),
	})

	const {data: stats} = useQuery<PollutionStats>({
		queryKey: ['pollution-stats', params],
		queryFn: () => pollutionApi.getStats(params),
	})

	const createMutation = useMutation({
		mutationFn: (payload: CreateMarkerVariables) => pollutionApi.create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({id, payload}: UpdateMarkerVariables) => pollutionApi.patch(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => pollutionApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

	return {
		markers,
		stats,
		isLoading,
		createMarker: createMutation.mutate,
		updateMarker: updateMutation.mutate,
		deleteMarker: deleteMutation.mutate,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		createError: createMutation.error,
		resetCreateError: createMutation.reset,
	}
}
