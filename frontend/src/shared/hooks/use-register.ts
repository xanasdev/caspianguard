import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authService} from '@/shared/api/auth.service'

export const useRegister = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			queryClient.setQueryData(['user'], data.user)
			window.location.href = '/'
		},
	})
}
