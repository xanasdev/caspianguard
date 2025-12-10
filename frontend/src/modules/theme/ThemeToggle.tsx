'use client'

import {Button} from '@/shared/components/ui/Button'
import {Moon, Sun} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {useTheme} from 'next-themes'
import {useMemo, useSyncExternalStore} from 'react'

const emptySubscribe = () => () => {}

export const ThemeToggle = () => {
	const {resolvedTheme, setTheme} = useTheme()
	const t = useTranslations('theme')

	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	)

	const isDark = useMemo(() => resolvedTheme === 'dark', [resolvedTheme])

	if (!mounted) {
		return (
			<Button variant='ghost' size='sm' disabled aria-label='Toggle theme'>
				<Sun className='h-4 w-4' />
			</Button>
		)
	}

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			title={t('toggle')}
			aria-label={t('toggle')}
		>
			{isDark ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
		</Button>
	)
}
