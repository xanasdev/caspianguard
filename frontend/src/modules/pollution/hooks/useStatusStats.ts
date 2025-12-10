import {pollutionService} from '@/shared/api/pollution.service'
import {useQuery} from '@tanstack/react-query'
import {StatusStats} from '../domain/pollution.model'

export const useStatusStats = () => {
	return useQuery<StatusStats>({
		queryKey: ['status-stats'],
		queryFn: () => pollutionService.getStatusStats(),
		staleTime: 30000, // 30 seconds
		refetchInterval: 60000, // Refetch every minute
	})
}
