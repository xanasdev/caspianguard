import {useUser} from './use-user'
import {useLogin} from './use-login'
import {useRegister} from './use-register'
import {useLogout} from './use-logout'

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
