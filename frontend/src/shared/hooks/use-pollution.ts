import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {pollutionService} from '@/shared/api/pollution.service'
import {PollutionStatus, PollutionType} from '@/shared/types'

interface UsePollutionParams {
	status?: PollutionStatus
	type?: PollutionType
	region_type?: string
	pollution_type?: number
}

interface CreateMarkerData {
	latitude: string
	longitude: string
	description: string
	region_type: string
	pollution_type: {
		name: string
		description?: string
	}
	photos?: Array<{image_path: string}>
}

interface UpdateMarkerData {
	id: number
	data: {
		latitude?: string
		longitude?: string
		description?: string
		region_type?: string
		pollution_type?: {
			name: string
			description?: string
		}
	}
}

export const usePollution = (params?: UsePollutionParams) => {
	const queryClient = useQueryClient()

	const {data: points = [], isLoading} = useQuery({
		queryKey: ['pollution', params],
		queryFn: () =>
			pollutionService.getAll({
				pollution_type: params?.pollution_type,
				region_type: params?.region_type,
			}),
	})

	const {data: stats} = useQuery({
		queryKey: ['pollution-stats'],
		queryFn: pollutionService.getStats,
	})

	const createMutation = useMutation({
		mutationFn: (data: CreateMarkerData) => pollutionService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

	const updateMutation = useMutation({
		mutationFn: ({id, data}: UpdateMarkerData) =>
			pollutionService.patch(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => pollutionService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['pollution']})
			queryClient.invalidateQueries({queryKey: ['pollution-stats']})
		},
	})

  return {
    points,
    stats,
    isLoading,
    createPoint: createMutation.mutate,
    updatePoint: updateMutation.mutate,
    deletePoint: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
