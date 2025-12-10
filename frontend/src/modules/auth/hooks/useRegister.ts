import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'

export const useRegister = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: authApi.register,
		onSuccess: (data) => {
			queryClient.setQueryData(['user'], data.user)
			window.location.href = '/'
		},
	})
}
