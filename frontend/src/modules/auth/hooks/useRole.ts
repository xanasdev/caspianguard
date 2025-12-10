import {useQuery} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'

export const useRole = (id?: number) => {
	return useQuery({
		queryKey: ['roles', id],
		queryFn: () => roleApi.getById(id as number),
		enabled: typeof id === 'number',
		staleTime: 5 * 60 * 1000,
	})
}
