'use client'

import {Card} from '@/shared/components/ui/Card'
import styles from '@/shared/styles/dashboard.module.css'
import {useTranslations} from 'next-intl'
import {PollutionStats} from '../../domain/pollution.model'
import {useStatusStats} from '../../hooks/useStatusStats'

interface PollutionDashboardStatsProps {
	stats?: PollutionStats
}

export const PollutionDashboardStats = ({
	stats,
}: PollutionDashboardStatsProps) => {
	const t = useTranslations('dashboard.stats')
	const {data: statusStats} = useStatusStats()
	if (!stats) return null

	return (
		<div className={styles.statsGrid}>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>{t('total')}</p>
				<p className='text-2xl font-bold'>{stats.total}</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>{t('reported')}</p>
				<p className='text-2xl font-bold text-red-500'>{stats.reported}</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>{t('inProgress')}</p>
				<p className='text-2xl font-bold text-yellow-500'>
					{statusStats?.in_progress ?? 0}
				</p>
			</Card>
			<Card className={styles.pointCard}>
				<p className='text-sm text-muted-foreground'>{t('cleaned')}</p>
				<p className='text-2xl font-bold text-green-500'>
					{statusStats?.cleared ?? 0}
				</p>
			</Card>
		</div>
	)
}
