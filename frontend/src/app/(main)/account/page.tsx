'use client'

import {AccountActionsCard} from '@/modules/account/ui/AccountActionsCard'
import {AccountHeader} from '@/modules/account/ui/AccountHeader'
import {AccountMetaCard} from '@/modules/account/ui/AccountMetaCard'
import {AccountProfileForm} from '@/modules/account/ui/AccountProfileForm'
import {AccountRolesManager} from '@/modules/account/ui/AccountRolesManager'
import {useAuth, useManagerData} from '@/modules/auth'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/account-page.module.css'
import {useMemo} from 'react'

const sections = {
	citizen: {
		title: 'Ваш маршрут',
		description: 'Следите за состоянием побережья и делитесь новыми метками.',
		items: [
			'Сообщайте о новых загрязнениях',
			'Просматривайте ближайшие точки',
			'Следите за статусом уборок',
		],
	},
	activist: {
		title: 'Инструменты активиста',
		description: 'Организуйте волонтеров и контролируйте процесс очистки.',
		items: [
			'Модерируйте точки и меняйте статусы',
			'Экспортируйте отчеты по районам',
			'Планируйте субботники',
		],
	},
	admin: {
		title: 'Панель администратора',
		description: 'Управляйте доступами и следите за метриками проекта.',
		items: [
			'Назначайте роли пользователям',
			'Контролируйте качество данных',
			'Получайте аналитические отчеты',
		],
	},
}

type SectionKey = keyof typeof sections

export default function AccountPage() {
	const {user, isLoading} = useAuth()
	const roleKey = useMemo<SectionKey>(() => {
		const role = user?.role_name ?? 'CITIZEN'
		if (role === 'ADMIN') return 'admin'
		if (role === 'ACTIVIST') return 'activist'
		return 'citizen'
	}, [user?.role_name])

	useManagerData()

	if (isLoading || !user) {
		return (
			<div className={styles.page}>
				<DashboardHeader />
				<div className={`${styles.container} page-transition`}>
					<Card>
						<CardContent className={styles.placeholder}>
							Загрузка профиля...
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	const section = sections[roleKey]

	return (
		<div className={styles.page}>
			<DashboardHeader />
			<main className={`${styles.container} page-transition stagger-children`}>
				<AccountHeader user={user} />
				<div className={styles.grid}>
					<AccountMetaCard user={user} />
					<AccountActionsCard role={user.role_name} />
					<AccountProfileForm user={user} />
				</div>
				<section className={styles.section}>
					<Card>
						<CardHeader>
							<CardTitle className={styles.sectionTitle}>
								{section.title}
							</CardTitle>
							<CardDescription>{section.description}</CardDescription>
						</CardHeader>
						<CardContent className={styles.cardContent}>
							{section.items.map((item) => (
								<div key={item} className={styles.metaItem}>
									<span className={styles.metaLabel}>Задача</span>
									<span className={styles.metaValue}>{item}</span>
								</div>
							))}
						</CardContent>
					</Card>

					{roleKey === 'admin' && (
						<div className={styles.adminSection}>
							<AccountRolesManager canManage />
							{/* <AccountUsersManager canManage /> */}
						</div>
					)}
				</section>
			</main>
		</div>
	)
}
