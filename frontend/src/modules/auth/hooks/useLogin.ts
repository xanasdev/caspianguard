import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (data) => {
			queryClient.setQueryData(['user'], data.user)
			window.location.href = '/'
		},
	})
}
