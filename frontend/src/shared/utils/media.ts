import {env} from '@/shared/config/env'

const API_SUFFIX = '/api'

const getBaseUrl = () => {
	const url = env.apiUrl
	if (url.endsWith(API_SUFFIX)) {
		return url.slice(0, -API_SUFFIX.length)
	}
	return url.replace(/\/$/, '')
}

export const getMediaUrl = (path?: string | null) => {
	if (!path) return undefined
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}
	const baseUrl = getBaseUrl()
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	return `${baseUrl}${normalizedPath}`
}
