import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authService} from '@/shared/api/auth.service'

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			queryClient.setQueryData(['user'], data.user)
			window.location.href = '/'
		},
	})
}
