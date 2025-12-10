import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {path: '/'} as const

export const tokenStorage = {
	getAccess: () => Cookies.get('access_token'),

	setTokens: (access: string, refresh: string) => {
		Cookies.set('access_token', access, {...COOKIE_OPTIONS, expires: 1})
		Cookies.set('auth_token', access, {...COOKIE_OPTIONS, expires: 1})
		Cookies.set('refresh_token', refresh, {...COOKIE_OPTIONS, expires: 7})
	},

	setAccess: (access: string) => {
		Cookies.set('access_token', access, {...COOKIE_OPTIONS, expires: 1})
		Cookies.set('auth_token', access, {...COOKIE_OPTIONS, expires: 1})
	},

	clear: () => {
		Cookies.remove('access_token', COOKIE_OPTIONS)
		Cookies.remove('auth_token', COOKIE_OPTIONS)
		Cookies.remove('refresh_token', COOKIE_OPTIONS)
	},
}
