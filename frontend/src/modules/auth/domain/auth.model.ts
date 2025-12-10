export interface LoginCredentials {
	username: string
	password: string
}

export interface RegisterPayload {
	username: string
	email: string
	password: string
	password_confirm: string
	first_name?: string
	last_name?: string
	phone?: string
}

export interface AuthTokens {
	access: string
	refresh: string
}

export interface AuthUser {
	id: number
	username: string
	email: string
	first_name: string
	last_name: string
	phone: string
	role: number | null
	role_name?: string
	name?: string
	avatar?: string
}

export interface UpdateUserPayload {
	username?: string
	email?: string
	first_name?: string
	last_name?: string
	phone?: string
	role?: number | null
}

export enum UserRole {
	CITIZEN = 'CITIZEN',
	ACTIVIST = 'ACTIVIST',
	ADMIN = 'ADMIN',
}

export interface LoginResponse {
	access: string
	refresh: string
	user: AuthUser
}

export interface RegisterResponse {
	user: AuthUser
	access: string
	refresh: string
}
