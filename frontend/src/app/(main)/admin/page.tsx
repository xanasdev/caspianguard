'use client'

import {
	AuthUser,
	useAssignRole,
	useAuth,
	useRoles,
	useUsers,
} from '@/modules/auth'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {Card} from '@/shared/components/ui/Card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/Select'
import styles from '@/shared/styles/dashboard-page.module.css'
import {useTranslations} from 'next-intl'
import {useMemo} from 'react'

export default function AdminPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const tAccessDenied = useTranslations('dashboard.accessDenied')
	const {user} = useAuth()
	const {
		data: users = [],
		isLoading: isUsersLoading,
		isError: isUsersError,
		refetch,
	} = useUsers()
	const {
		data: roles = [],
		isLoading: isRolesLoading,
		isError: isRolesError,
	} = useRoles()
	const assignRole = useAssignRole()

	const isAdmin = useMemo(() => {
		const role = user?.role_name ?? user?.role
		return role === 'ADMIN'
	}, [user?.role_name, user?.role])

	if (!isAdmin) {
		return (
			<div className={styles.fullPage}>
				<DashboardHeader />
				<div className={styles.container}>
					<Card className={styles.accessDenied}>
						<h2 className={styles.accessTitle}>{tAccessDenied('title')}</h2>
						<p className='text-muted-foreground'>
							{tAccessDenied('description')}
						</p>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.fullPage}>
			<DashboardHeader />
			<div className={`${styles.container} space-y-6`}>
				<header className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
					<div>
						<h1 className='text-2xl font-semibold tracking-tight'>
							{t('title')}
						</h1>
						<p className='text-sm text-muted-foreground'>
							{t('users.description')}
						</p>
					</div>
					<Button
						variant='outline'
						onClick={() => refetch()}
						disabled={isUsersLoading || assignRole.isPending}
					>
						Обновить список
					</Button>
				</header>

				<Card className='overflow-hidden'>
					<div className='border-b border-border bg-muted/30 px-6 py-4'>
						<h2 className='text-sm font-medium uppercase tracking-wide text-muted-foreground'>
							{t('users.title')}
						</h2>
					</div>
					<div className='divide-y divide-border'>
						{isUsersError ? (
							<p className='px-6 py-8 text-sm text-destructive'>
								Не удалось загрузить список пользователей
							</p>
						) : isRolesError ? (
							<p className='px-6 py-8 text-sm text-destructive'>
								Не удалось загрузить список ролей
							</p>
						) : isUsersLoading || isRolesLoading ? (
							<p className='px-6 py-8 text-sm text-muted-foreground'>
								{tCommon('loading')}
							</p>
						) : users.length === 0 ? (
							<p className='px-6 py-8 text-sm text-muted-foreground'>
								{t('users.empty')}
							</p>
						) : (
							users.map((item: AuthUser) => {
								const currentRole = item.role_name ?? item.role ?? 'Нет роли'
								return (
									<div
										key={item.id}
										className='grid gap-4 px-6 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center'
									>
										<div className='space-y-1'>
											<p className='font-medium'>{item.username}</p>
											<p className='text-sm text-muted-foreground'>
												{item.email}
											</p>
										</div>
										<div className='flex items-center gap-2'>
											<Badge variant='outline'>{currentRole}</Badge>
										</div>
										<div>
											<Select
												disabled={assignRole.isPending}
												defaultValue={item.role ? String(item.role) : undefined}
												onValueChange={(value) => {
													assignRole.mutate({
														user_id: item.id,
														role_id: Number(value),
													})
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder='Выберите роль' />
												</SelectTrigger>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem key={role.id} value={String(role.id)}>
															{role.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								)
							})
						)}
					</div>
				</Card>
			</div>
		</div>
	)
}
