import {useUser} from './useUser'
import {useLogin} from './useLogin'
import {useRegister} from './useRegister'
import {useLogout} from './useLogout'

export const useAuth = () => {
	const {data: user, isLoading} = useUser()
	const loginMutation = useLogin()
	const registerMutation = useRegister()
	const logout = useLogout()

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout,
		isLoginLoading: loginMutation.isPending,
		isRegisterLoading: registerMutation.isPending,
	}
}
