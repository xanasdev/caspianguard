import {useQuery} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'
import {AuthUser} from '../domain/auth.model'

interface UseUsersOptions {
	enabled?: boolean
}

export const useUsers = (options?: UseUsersOptions) => {
	return useQuery<AuthUser[]>({
		queryKey: ['users'],
		queryFn: authApi.getUsers,
		staleTime: 5 * 60 * 1000,
		enabled: options?.enabled,
	})
}
