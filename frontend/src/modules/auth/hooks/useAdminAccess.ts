import {useQuery} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'

export const useAdminAccess = () => {
	return useQuery({
		queryKey: ['admin-access'],
		queryFn: authApi.checkAdminAccess,
		retry: false,
		staleTime: 60 * 1000,
	})
}
