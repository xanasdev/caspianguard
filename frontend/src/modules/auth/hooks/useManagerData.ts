import {useQuery} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'

export const useManagerData = <T = unknown>() =>
	useQuery<T>({
		queryKey: ['manager-data'],
		queryFn: () => authApi.getManagerData<T>(),
		staleTime: 60 * 1000,
		refetchOnWindowFocus: false,
	})
