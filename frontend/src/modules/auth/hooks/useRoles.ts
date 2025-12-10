import {useQuery} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'

interface UseRolesOptions {
	enabled?: boolean
}

export const useRoles = (options?: UseRolesOptions) => {
	return useQuery({
		queryKey: ['roles'],
		queryFn: roleApi.getAll,
		staleTime: 5 * 60 * 1000,
		enabled: options?.enabled,
	})
}
