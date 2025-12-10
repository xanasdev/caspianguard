import {useQuery} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'
import {tokenStorage} from '../utils/token.storage'

export const useUser = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			if (!tokenStorage.getAccess()) return null

			try {
				return await authApi.getCurrentUser()
			} catch {
				tokenStorage.clear()
				return null
			}
		},
		retry: false,
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	})
}
