import {Filter as FilterIcon, X, Loader2} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/shared/components/ui/Select'
import {Label} from '@/shared/components/ui/Label'
import {Button} from '@/shared/components/ui/Button'
import {Badge} from '@/shared/components/ui/Badge'
import styles from '@/shared/styles/filter.module.css'
import {PollutionStatus} from '../../domain/pollution.model'
import {usePollutionTypes} from '../../hooks/usePollutionTypes'
import {useTranslations} from 'next-intl'

interface FilterPanelProps {
	status?: PollutionStatus
	type?: string
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: string) => void
	onReset: () => void
}

export const FilterPanel = ({status, type, onStatusChange, onTypeChange, onReset}: FilterPanelProps) => {
	const hasActiveFilters = Boolean(status || type)
	const t = useTranslations()
	const {data: pollutionTypes, isLoading: typesLoading} = usePollutionTypes()

	const statusLabels: Record<PollutionStatus, string> = {
		[PollutionStatus.REPORTED]: t('status.reported'),
		[PollutionStatus.IN_PROGRESS]: t('status.inProgress'),
		[PollutionStatus.CLEANED]: t('status.cleaned'),
		[PollutionStatus.VERIFIED]: t('status.verified'),
	}

	return (
		<div className={styles.filterContainer}>
			{hasActiveFilters && (
				<div className={styles.activeFilters}>
					<div className='flex items-center gap-2 flex-wrap w-full'>
						<FilterIcon className='h-4 w-4' />
						<span className='text-sm font-semibold'>{t('filter.active')}</span>
						{status && (
							<Badge variant='default' className={styles.filterBadge}>
								{statusLabels[status] ?? status}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onStatusChange(undefined)} />
							</Badge>
						)}
						{type && (
							<Badge variant='default' className={styles.filterBadge}>
								{type}
								<X className='h-3 w-3 cursor-pointer' onClick={() => onTypeChange(undefined)} />
							</Badge>
						)}
					</div>
				</div>
			)}

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>{t('filter.status')}</Label>
				<p className={styles.filterDescription}>{t('filter.statusDescription')}</p>
				<Select value={status ?? 'all'} onValueChange={(value) => onStatusChange(value === 'all' ? undefined : (value as PollutionStatus))}>
					<SelectTrigger>
						<SelectValue placeholder={t('filter.allStatuses')} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>{t('filter.allStatuses')}</SelectItem>
						<SelectItem value={PollutionStatus.REPORTED}>🔴 {t('status.reported')}</SelectItem>
						<SelectItem value={PollutionStatus.IN_PROGRESS}>🟡 {t('status.inProgress')}</SelectItem>
						<SelectItem value={PollutionStatus.CLEANED}>🟢 {t('status.cleaned')}</SelectItem>
						<SelectItem value={PollutionStatus.VERIFIED}>🔵 {t('status.verified')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className={styles.filterSection}>
				<Label className={styles.filterLabel}>{t('filter.type')}</Label>
				<p className={styles.filterDescription}>{t('filter.typeDescription')}</p>
				{typesLoading ? (
					<div className='flex items-center gap-2 text-sm text-muted-foreground py-2'>
						<Loader2 className='h-4 w-4 animate-spin' />
						Загрузка типов...
					</div>
				) : (
					<Select value={type ?? 'all'} onValueChange={(value) => onTypeChange(value === 'all' ? undefined : value)}>
						<SelectTrigger>
							<SelectValue placeholder={t('filter.allTypes')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>{t('filter.allTypes')}</SelectItem>
							{pollutionTypes?.map((pollutionType) => (
								<SelectItem key={pollutionType.id} value={pollutionType.name}>
									{pollutionType.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{hasActiveFilters && (
				<div className={styles.filterActions}>
					<Button onClick={onReset} variant='outline' className={styles.resetButton}>
						{t('filter.reset')}
					</Button>
				</div>
			)}
		</div>
	)
}
