import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {path: '/'} as const

export const tokenUtils = {
	get: () => Cookies.get('access_token'),

	set: (token: string) => {
		Cookies.set('access_token', token, {...COOKIE_OPTIONS, expires: 7})
		Cookies.set('auth_token', token, {...COOKIE_OPTIONS, expires: 7})
	},

	remove: () => {
		Cookies.remove('access_token', COOKIE_OPTIONS)
		Cookies.remove('auth_token', COOKIE_OPTIONS)
		Cookies.remove('refresh_token', COOKIE_OPTIONS)
	},

	exists: () => !!Cookies.get('access_token'),
}
