import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

export const httpClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {'Content-Type': 'application/json'},
})

httpClient.interceptors.request.use(
	(config) => {
		const token = Cookies.get('access_token')
		if (token) config.headers.Authorization = `Bearer ${token}`
		return config
	},
	(error) => Promise.reject(error),
)

httpClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			Cookies.remove('access_token', {path: '/'})
			Cookies.remove('auth_token', {path: '/'})
			Cookies.remove('refresh_token', {path: '/'})
			if (typeof window !== 'undefined') window.location.href = '/login'
		}
		return Promise.reject(error)
	},
)
