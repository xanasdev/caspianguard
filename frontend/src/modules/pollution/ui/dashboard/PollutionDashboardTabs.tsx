import {useMemo} from 'react'
import {Card} from '@/shared/components/ui/Card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/shared/components/ui/Tabs'
import {PollutionCard} from '../PollutionCard'
import styles from '@/shared/styles/dashboard-page.module.css'
import {Marker, PollutionStatus} from '../../domain/pollution.model'
import {useTranslations} from 'next-intl'

interface PollutionDashboardTabsProps {
	activeStatus: PollutionStatus
	onStatusChange: (status: PollutionStatus) => void
	markers: Marker[]
	statuses?: PollutionStatus[]
}

const DEFAULT_STATUSES: PollutionStatus[] = [
	PollutionStatus.REPORTED,
	PollutionStatus.IN_PROGRESS,
	PollutionStatus.CLEANED,
]

export const PollutionDashboardTabs = ({
	activeStatus,
	onStatusChange,
	markers,
	statuses = DEFAULT_STATUSES,
}: PollutionDashboardTabsProps) => {
	const renderedMarkers = useMemo(() => markers, [markers])
	const tStatus = useTranslations('status')
	const tTabs = useTranslations('dashboard.tabs')

	return (
		<Tabs
			value={activeStatus}
			onValueChange={(value) => onStatusChange(value as PollutionStatus)}
			className={styles.tabs}
		>
			<TabsList>
				{statuses.map((status) => (
					<TabsTrigger key={status} value={status}>
						{statusLabels[status] ? tStatus(statusLabels[status]) : status}
					</TabsTrigger>
				))}
			</TabsList>

			<TabsContent value={activeStatus} className={styles.tabContent}>
				{renderedMarkers.length === 0 ? (
					<Card className={styles.emptyState}>
						<p className={styles.emptyText}>{tTabs('empty')}</p>
					</Card>
				) : (
					<div className={styles.pointsGrid}>
						{renderedMarkers.map((marker) => (
							<PollutionCard key={marker.id} marker={marker} />
						))}
					</div>
				)}
			</TabsContent>
		</Tabs>
	)
}

const statusLabels: Record<PollutionStatus, string> = {
	[PollutionStatus.REPORTED]: 'reported',
	[PollutionStatus.IN_PROGRESS]: 'inProgress',
	[PollutionStatus.CLEANED]: 'cleaned',
	[PollutionStatus.VERIFIED]: 'verified',
}
