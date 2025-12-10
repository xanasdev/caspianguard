'use client'

import {PollutionDashboardStats} from '@/modules/pollution/ui/dashboard/PollutionDashboardStats'
import {PollutionDashboardHeader} from '@/modules/pollution/ui/dashboard/PollutionDashboardHeader'
import {PollutionDashboardTabs} from '@/modules/pollution/ui/dashboard/PollutionDashboardTabs'
import {DashboardHeader} from '@/modules/layout/DashboardHeader'
import {Card} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/dashboard-page.module.css'
import {PollutionStatus} from '@/modules/pollution/domain/pollution.model'
import {usePollutionDashboard} from '@/modules/pollution/hooks/usePollutionDashboard'
import {useTranslations} from 'next-intl'

export default function DashboardPage() {
	const {
		canManage,
		activeStatus,
		markers,
		stats,
		handleStatusChange,
		handleExport,
	} = usePollutionDashboard()
	const t = useTranslations('dashboard')
	const tDashboard = useTranslations('dashboard.accessDenied')

	if (!canManage) {
		return (
			<div className={styles.fullPage}>
				<DashboardHeader />
				<div className={`${styles.container} page-transition-slide`}>
					<Card className={styles.accessDenied}>
						<h2 className={styles.accessTitle}>{tDashboard('title')}</h2>
						<p className='text-muted-foreground'>{tDashboard('description')}</p>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.fullPage}>
			<DashboardHeader />
			<div className={`${styles.container} page-transition stagger-children`}>
				<PollutionDashboardHeader
					title={t('title')}
					actionLabel={t('export')}
					onAction={handleExport}
				/>

				<PollutionDashboardStats stats={stats} />

				<PollutionDashboardTabs
					activeStatus={activeStatus}
					onStatusChange={handleStatusChange}
					markers={markers}
					statuses={[PollutionStatus.REPORTED, PollutionStatus.IN_PROGRESS, PollutionStatus.CLEANED]}
				/>
			</div>
		</div>
	)
}
