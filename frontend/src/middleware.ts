import {NextRequest, NextResponse} from 'next/server'
import {defaultLocale} from '@/i18n/config'

const PUBLIC_ROUTES = ['/login', '/register']
const AUTH_ROUTES = ['/login', '/register']
const LOCALE_PREFIX = /^\/(en|ru|kk|az)(?=\/|$)/

const applyLocalePrefix = (pathname: string) => {
	const match = pathname.match(LOCALE_PREFIX)
	if (!match) return {locale: undefined, path: pathname}
	return {locale: match[1], path: pathname.slice(match[0].length) || '/'}
}

export function middleware(request: NextRequest) {
	const token = request.cookies.get('access_token')?.value
	const {pathname} = request.nextUrl

	const {locale, path} = applyLocalePrefix(pathname)
	const basePath = path.startsWith('/') ? path : `/${path}`

	if (!locale) {
		const redirectTarget = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
		return NextResponse.redirect(new URL(redirectTarget, request.url))
	}

	const isPublicRoute = PUBLIC_ROUTES.some((route) => basePath.startsWith(route))
	const isAuthRoute = AUTH_ROUTES.some((route) => basePath.startsWith(route))

	if (!token && !isPublicRoute) {
		const loginUrl = new URL(`/${locale}/login`, request.url)
		return NextResponse.redirect(loginUrl)
	}

	if (token && isAuthRoute) {
		const homeUrl = new URL(`/${locale}`, request.url)
		return NextResponse.redirect(homeUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
