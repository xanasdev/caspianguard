import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {ScrollArea} from '@/shared/components/ui/ScrollArea'
import {Separator} from '@/shared/components/ui/Separator'
import type {PollutionStats} from '@/shared/interfaces/components.interface'
import styles from '@/shared/styles/sidebar.module.css'
import {PollutionPoint, PollutionStatus} from '@/shared/types'
import {getMarkerIcon} from '@/shared/utils/marker.utils'
import {
	AlertTriangle,
	CheckCircle,
	Clock,
	Filter,
	MapPin,
	Plus,
	TrendingUp,
} from 'lucide-react'

interface DashboardSidebarProps {
	stats?: PollutionStats
	points: PollutionPoint[]
	onPointClick: (point: PollutionPoint) => void
	onFilterClick: () => void
	onReportClick: () => void
}

export function DashboardSidebar({
	stats,
	points,
	onPointClick,
	onFilterClick,
	onReportClick,
}: DashboardSidebarProps) {
	const getStatusColor = (status: PollutionStatus) => {
		switch (status) {
			case PollutionStatus.REPORTED:
				return 'destructive'
			case PollutionStatus.IN_PROGRESS:
				return 'default'
			case PollutionStatus.CLEANED:
				return 'secondary'
			case PollutionStatus.VERIFIED:
				return 'outline'
			default:
				return 'default'
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.section}>
				<div className={styles.statsGrid}>
					<div className={styles.statCard}>
						<TrendingUp className={styles.statIconBlue} />
						<div className={styles.statContent}>
							<p className={styles.statValue}>{stats?.total || 0}</p>
							<p className={styles.statLabel}>Всего</p>
						</div>
					</div>

					<div className={styles.statCard}>
						<AlertTriangle className={styles.statIconRed} />
						<div className={styles.statContent}>
							<p className={styles.statValue}>{stats?.reported || 0}</p>
							<p className={styles.statLabel}>Активных</p>
						</div>
					</div>

					<div className={styles.statCard}>
						<Clock className={styles.statIconYellow} />
						<div className={styles.statContent}>
							<p className={styles.statValue}>{stats?.inProgress || 0}</p>
							<p className={styles.statLabel}>В работе</p>
						</div>
					</div>

					<div className={styles.statCard}>
						<CheckCircle className={styles.statIconGreen} />
						<div className={styles.statContent}>
							<p className={styles.statValue}>{stats?.cleaned || 0}</p>
							<p className={styles.statLabel}>Очищено</p>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div className={styles.section}>
				<div className={styles.actions}>
					<Button onClick={onReportClick} size='sm' className='flex-1'>
						<Plus className='h-4 w-4 mr-2' />
						Сообщить
					</Button>
					<Button variant='outline' size='sm' onClick={onFilterClick}>
						<Filter className='h-4 w-4 mr-2' />
						Фильтры
					</Button>
				</div>
			</div>

			<Separator />

			<div className={styles.listSection}>
				<div className={styles.listHeader}>
					<h2 className={styles.sectionTitle}>Точки загрязнения</h2>
					<Badge variant='secondary'>{points.length}</Badge>
				</div>
				<ScrollArea className={styles.scrollArea}>
					<div className={styles.pointsList}>
						{points.length === 0 ? (
							<div className={styles.emptyState}>
								<MapPin className='h-10 w-10 text-muted-foreground' />
								<p className={styles.emptyText}>Нет точек загрязнения</p>
							</div>
						) : (
							points.map((point) => (
								<div
									key={point.id}
									className={styles.pointCard}
									onClick={() => onPointClick(point)}
								>
									<div className={styles.pointIcon}>
										<span className={styles.emoji}>
											{getMarkerIcon(point.pollution_type.name)}
										</span>
									</div>
									<div className={styles.pointContent}>
										<div className={styles.pointTop}>
											<p className={styles.pointTitle}>
												{point.pollution_type.name.replace(/_/g, ' ')}
											</p>
											<Badge variant='secondary' className={styles.statusBadge}>
												{point.region_type}
											</Badge>
										</div>
										<p className={styles.pointDescription}>
											{point.description.length > 60
												? `${point.description.substring(0, 60)}...`
												: point.description}
										</p>
										<p className={styles.pointDate}>
											{new Date(point.created_at).toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
											})}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	)
}
