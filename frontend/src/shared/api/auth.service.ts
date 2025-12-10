import Cookies from 'js-cookie'
import api from '../lib/axios'
import {AuthTokens, User} from '../types'

interface LoginCredentials {
	username: string
	password: string
}

interface RegisterData {
	username: string
	email: string
	password: string
	password_confirm: string
	first_name?: string
	last_name?: string
	phone?: string
}

interface LoginResponse {
	access: string
	refresh: string
	user: User
}

interface RegisterResponse {
	user: User
	access: string
	refresh: string
}

export const authService = {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const {data} = await api.post<LoginResponse>('/auth/login/', credentials)
		Cookies.set('access_token', data.access, {expires: 1, path: '/'})
		Cookies.set('auth_token', data.access, {expires: 1, path: '/'})
		Cookies.set('refresh_token', data.refresh, {expires: 7, path: '/'})
		return data
	},

	async register(userData: RegisterData): Promise<RegisterResponse> {
		const {data} = await api.post<RegisterResponse>('/auth/register/', userData)
		Cookies.set('access_token', data.access, {expires: 1, path: '/'})
		Cookies.set('auth_token', data.access, {expires: 1, path: '/'})
		Cookies.set('refresh_token', data.refresh, {expires: 7, path: '/'})
		return data
	},

	async getCurrentUser(): Promise<User> {
		const {data} = await api.get<User>('/user/profile/')
		return {
			...data,
			name:
				data.first_name && data.last_name
					? `${data.first_name} ${data.last_name}`.trim()
					: data.username,
		}
	},

	async refreshToken(refresh: string): Promise<AuthTokens> {
		const {data} = await api.post<AuthTokens>('/auth/refresh/', {
			refresh,
		})
		Cookies.set('access_token', data.access, {expires: 1, path: '/'})
		Cookies.set('auth_token', data.access, {expires: 1, path: '/'})
		return data
	},

	async logout(): Promise<void> {
		Cookies.remove('access_token', {path: '/'})
		Cookies.remove('auth_token', {path: '/'})
		Cookies.remove('refresh_token', {path: '/'})
		return Promise.resolve()
	},
}
