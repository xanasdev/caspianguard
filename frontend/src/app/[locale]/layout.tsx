import {ReactNode} from 'react'
import {notFound} from 'next/navigation'
import {setRequestLocale} from 'next-intl/server'
import {Providers} from '@/app/providers'
import {AppLocale, defaultLocale, locales} from '@/i18n/config'

interface LocaleLayoutProps {
	children: ReactNode
	params: Promise<{locale?: string}>
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
	const {locale: rawLocale} = await params
	const locale = (rawLocale ?? defaultLocale) as AppLocale
	if (!locales.includes(locale)) {
		notFound()
	}

	setRequestLocale(locale)
	const messages = (await import(`@/i18n/messages/${locale}.json`)).default

	return <Providers locale={locale} messages={messages}>{children}</Providers>
}
