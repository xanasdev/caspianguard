import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'
import {UpdateUserPayload} from '../domain/auth.model'

interface UseUpdateUserVariables extends UpdateUserPayload {
	id: number
}

export const useUpdateUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({id, ...payload}: UseUpdateUserVariables) => authApi.patchUser(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['user']})
			queryClient.invalidateQueries({queryKey: ['users']})
		},
	})
}
