import {useMutation, useQueryClient} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'
import {AssignRolePayload} from '../domain/role.model'

export const useAssignRole = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: AssignRolePayload) => roleApi.assign(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['user']})
			queryClient.invalidateQueries({queryKey: ['users']})
		},
	})
}
