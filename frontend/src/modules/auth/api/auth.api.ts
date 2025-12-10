import {httpClient} from '@/shared/api/http.client'
import {
	AuthTokens,
	AuthUser,
	LoginCredentials,
	LoginResponse,
	RegisterPayload,
	RegisterResponse,
	UpdateUserPayload,
} from '../domain/auth.model'
import {tokenStorage} from '../utils/token.storage'

const AuthEndpoints = {
	login: '/auth/login/',
	register: '/auth/register/',
	profile: '/user/profile/',
	refresh: '/auth/refresh/',
	adminOnly: '/auth/admin-only/',
	manager: '/auth/manager/',
	users: '/auth/users/',
	user: (id: number) => `/auth/users/${id}/`,
} as const

export const authApi = {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		// Django TokenObtainPairView returns only {access, refresh}
		const {data: tokens} = await httpClient.post<AuthTokens>(AuthEndpoints.login, credentials)
		tokenStorage.setTokens(tokens.access, tokens.refresh)
		
		// Fetch user profile after successful login
		const user = await authApi.getCurrentUser()
		
		return {
			access: tokens.access,
			refresh: tokens.refresh,
			user,
		}
	},

	async register(payload: RegisterPayload): Promise<RegisterResponse> {
		// Backend expects: {username, password, first_name, last_name}
		const backendPayload = {
			username: payload.username,
			password: payload.password,
			first_name: payload.first_name || '',
			last_name: payload.last_name || '',
		}
		
		// Backend returns: {user: {username, first_name, last_name, telegram_id}, access, refresh}
		const {data} = await httpClient.post<{
			user: {username: string; first_name: string; last_name: string; telegram_id: number | null}
			access: string
			refresh: string
		}>(AuthEndpoints.register, backendPayload)
		
		tokenStorage.setTokens(data.access, data.refresh)
		
		// Transform backend user to AuthUser format
		const user: AuthUser = {
			id: 0,
			username: data.user.username,
			email: payload.email || '',
			first_name: data.user.first_name || '',
			last_name: data.user.last_name || '',
			phone: payload.phone || '',
			role: null,
			role_name: undefined,
			name: data.user.first_name && data.user.last_name
				? `${data.user.first_name} ${data.user.last_name}`.trim()
				: data.user.username,
		}
		
		return {
			user,
			access: data.access,
			refresh: data.refresh,
		}
	},

	async getCurrentUser(): Promise<AuthUser> {
		// Backend UserProfileView returns: {username, telegram_username, first_name, last_name, position, completed_count}
		const {data} = await httpClient.get<{
			username: string
			telegram_username: string
			first_name: string
			last_name: string
			position: string
			completed_count: number
		}>(AuthEndpoints.profile)
		
		return {
			id: 0, // Backend doesn't return id in profile endpoint
			username: data.username,
			email: '',
			first_name: data.first_name,
			last_name: data.last_name,
			phone: '',
			role: null,
			role_name: data.position,
			name: data.first_name && data.last_name 
				? `${data.first_name} ${data.last_name}`.trim() 
				: data.username,
		}
	},

	async refreshToken(refresh: string): Promise<AuthTokens> {
		const {data} = await httpClient.post<AuthTokens>(AuthEndpoints.refresh, {refresh})
		tokenStorage.setAccess(data.access)
		return data
	},

	async logout(): Promise<void> {
		tokenStorage.clear()
	},

	async getUsers(): Promise<AuthUser[]> {
		const {data} = await httpClient.get<AuthUser[]>(AuthEndpoints.users)
		return data
	},

	async getUserById(id: number): Promise<AuthUser> {
		const {data} = await httpClient.get<AuthUser>(AuthEndpoints.user(id))
		return data
	},

	async updateUser(id: number, payload: UpdateUserPayload): Promise<AuthUser> {
		const {data} = await httpClient.put<AuthUser>(AuthEndpoints.user(id), payload)
		return data
	},

	async patchUser(id: number, payload: Partial<UpdateUserPayload>): Promise<AuthUser> {
		const {data} = await httpClient.patch<AuthUser>(AuthEndpoints.user(id), payload)
		return data
	},

	async deleteUser(id: number): Promise<void> {
		await httpClient.delete(AuthEndpoints.user(id))
	},

	async checkAdminAccess(): Promise<boolean> {
		await httpClient.get(AuthEndpoints.adminOnly)
		return true
	},

	async getManagerData<T = unknown>(): Promise<T> {
		const {data} = await httpClient.get<T>(AuthEndpoints.manager)
		return data
	},
}
