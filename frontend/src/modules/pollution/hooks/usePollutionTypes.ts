import {useQuery} from '@tanstack/react-query'
import {pollutionApi} from '../api/pollution.api'

export const usePollutionTypes = () => {
	return useQuery({
		queryKey: ['pollution-types'],
		queryFn: () => pollutionApi.getPollutionTypes(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

