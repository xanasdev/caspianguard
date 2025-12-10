import {useQueryClient} from '@tanstack/react-query'
import {authService} from '@/shared/api/auth.service'

export const useLogout = () => {
	const queryClient = useQueryClient()

	return () => {
		authService.logout()
		queryClient.setQueryData(['user'], null)
		window.location.href = '/login'
	}
}
