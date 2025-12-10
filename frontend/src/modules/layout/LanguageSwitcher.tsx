'use client'

import {useMemo} from 'react'
import {useLocale} from 'next-intl'
import {usePathname, useRouter} from 'next/navigation'
import {Button} from '@/shared/components/ui/Button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem} from '@/shared/components/ui/DropdownMenu'

const locales = [
	{code: 'en', label: 'English'},
	{code: 'ru', label: 'Русский'},
	{code: 'kk', label: 'Қазақша'},
	{code: 'az', label: 'Azərbaycanca'},
]

const buildLocalizedPath = (pathname: string, target: string) => {
	const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/'
	if (withoutLocale === '/') return `/${target}`
	return `/${target}${withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`}`
}

export const LanguageSwitcher = () => {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()

	const current = useMemo(() => locales.find((item) => item.code === locale) ?? locales[0], [locale])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm'>
					{current.label}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{locales.map((item) => (
					<DropdownMenuItem
						key={item.code}
						onClick={() => {
							const href = buildLocalizedPath(pathname, item.code)
							router.replace(href)
							router.refresh()
						}}
						className={item.code === locale ? 'font-semibold' : ''}
					>
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
