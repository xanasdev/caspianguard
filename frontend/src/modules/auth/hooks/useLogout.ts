import {useQueryClient} from '@tanstack/react-query'
import {authApi} from '../api/auth.api'

export const useLogout = () => {
	const queryClient = useQueryClient()

	return () => {
		authApi.logout()
		queryClient.setQueryData(['user'], null)
		window.location.href = '/login'
	}
}
