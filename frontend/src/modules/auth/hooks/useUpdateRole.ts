import {useMutation, useQueryClient} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'
import {UpdateRolePayload} from '../domain/role.model'

interface UseUpdateRoleOptions {
	onSuccess?: () => void
}

export const useUpdateRole = ({onSuccess}: UseUpdateRoleOptions = {}) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({id, payload}: {id: number; payload: UpdateRolePayload}) => roleApi.update(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['roles']})
			queryClient.invalidateQueries({queryKey: ['roles', undefined]})
			onSuccess?.()
		},
	})
}
