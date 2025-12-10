import {useQuery} from '@tanstack/react-query'
import {authService} from '@/shared/api/auth.service'
import {tokenUtils} from '@/shared/utils/token.utils'

export const useUser = () => {
	return useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			if (!tokenUtils.exists()) return null

			try {
				return await authService.getCurrentUser()
			} catch {
				tokenUtils.remove()
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
