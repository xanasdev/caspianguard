import {useMutation, useQueryClient} from '@tanstack/react-query'
import {roleApi} from '../api/role.api'

export const useDeleteRole = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => roleApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['roles']})
		},
	})
}
