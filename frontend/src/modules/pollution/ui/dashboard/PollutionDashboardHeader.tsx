import {Button} from '@/shared/components/ui/Button'
import styles from '@/shared/styles/dashboard-page.module.css'
import {Download} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {ReactNode} from 'react'

interface PollutionDashboardHeaderProps {
	title?: string
	actionLabel?: string
	onAction: () => void
	actionIcon?: ReactNode
}

export const PollutionDashboardHeader = ({
	title,
	actionLabel,
	onAction,
	actionIcon = <Download className='h-4 w-4 mr-2' />,
}: PollutionDashboardHeaderProps) => {
	const t = useTranslations('dashboard')

	return (
		<div className={styles.pageHeader}>
			<h1 className={styles.pageTitle}>{title || t('title')}</h1>
			<Button onClick={onAction}>
				{actionIcon}
				{actionLabel || t('export')}
			</Button>
		</div>
	)
}
