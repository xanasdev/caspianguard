import {useAuth} from '@/modules/auth'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import styles from '@/shared/styles/header.module.css'
import {
	BarChart3,
	Home,
	LogIn,
	LogOut,
	User,
	UserCircle,
	UserPlus,
	Waves,
} from 'lucide-react'
import Link from 'next/link'
import {useLocale, useTranslations} from 'next-intl'
import {usePathname} from 'next/navigation'
import {ThemeToggle} from '@/modules/theme/ThemeToggle'
import {LanguageSwitcher} from '@/modules/layout/LanguageSwitcher'

const withLocale = (locale: string, path: string) => {
	if (!path.startsWith('/')) return path
	return `/${locale}${path === '/' ? '' : path}`
}

export const DashboardHeader = () => {
	const {user, logout} = useAuth()
	const pathname = usePathname()
	const locale = useLocale()
	const t = useTranslations()
	const buildLink = (path: string) => withLocale(locale, path)
	const currentPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/'
	const linkClass = (path: string) => (currentPath === path ? styles.navLinkActive : styles.navLink)

	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Waves className={styles.logoIcon} />
				<div className={styles.logoText}>
					<h1 className={styles.title}>{t('app.title')}</h1>
					<p className={styles.subtitle}>{t('app.tagline')}</p>
				</div>
			</div>

			<nav className={styles.nav}>
				{user ? (
					<>
						<Link href={buildLink('/')} className={linkClass('/')}
						>
							<Home className='h-4 w-4' />
							<span>{t('nav.map')}</span>
						</Link>
						<Link href={buildLink('/dashboard')} className={linkClass('/dashboard')}>
							<BarChart3 className='h-4 w-4' />
							<span>{t('nav.dashboard')}</span>
						</Link>
						<Link href={buildLink('/account')} className={linkClass('/account')}>
							<UserCircle className='h-4 w-4' />
							<span>{t('nav.profile')}</span>
						</Link>
					</>
				) : (
					<>
						<Link href={buildLink('/login')} className={linkClass('/login')}>
							<LogIn className='h-4 w-4' />
							<span>{t('nav.login')}</span>
						</Link>
						<Link href={buildLink('/register')} className={linkClass('/register')}>
							<UserPlus className='h-4 w-4' />
							<span>{t('nav.register')}</span>
						</Link>
					</>
				)}
			</nav>

			<div className={styles.actions}>
				<LanguageSwitcher />
				<ThemeToggle />
				{user && (
					<>
						<Link href={buildLink('/account')} className={styles.userInfo}>
							<User className='h-4 w-4' />
							<span className={styles.userEmail}>{user.email}</span>
							<Badge variant='outline' className={styles.roleBadge}>
								{user.role_name ?? user.role ?? 'USER'}
							</Badge>
						</Link>
						<Button variant='ghost' size='sm' onClick={logout}>
							<LogOut className='h-4 w-4' />
							<span className={styles.logoutText}>{t('nav.logout')}</span>
						</Button>
					</>
				)}
			</div>
		</header>
	)
}
