import {Button} from '@/shared/components/ui/Button'
import {Filter, Plus} from 'lucide-react'
import {useTranslations} from 'next-intl'

interface MapActionButtonsProps {
	onFilterClick: () => void
	onReportClick: () => void
}

export function MapActionButtons({
	onFilterClick,
	onReportClick,
}: MapActionButtonsProps) {
	const t = useTranslations('map')

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '1rem',
				right: '1rem',
				zIndex: 1000,
				display: 'flex',
				gap: '0.5rem',
			}}
		>
			<Button onClick={onFilterClick}>
				<Filter className='h-4 w-4 mr-2' />
				{t('openFilters')}
			</Button>
			<Button onClick={onReportClick}>
				<Plus className='h-4 w-4 mr-2' />
				{t('openReport')}
			</Button>
		</div>
	)
}
