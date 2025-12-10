import {useMutation, useQueryClient} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'
import {CreateRolePayload} from '../domain/role.model'

export const useCreateRole = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateRolePayload) => roleApi.create(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['roles']})
		},
	})
}
