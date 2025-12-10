import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/shared/components/ui/Sheet'
import {PollutionStatus} from '../../domain/pollution.model'
import {FilterPanel} from './FilterPanel'

interface FilterDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	status?: PollutionStatus
	type?: string
	onStatusChange: (status?: PollutionStatus) => void
	onTypeChange: (type?: string) => void
	onReset: () => void
}

export const FilterDrawer = ({
	open,
	onOpenChange,
	status,
	type,
	onStatusChange,
	onTypeChange,
	onReset,
}: FilterDrawerProps) => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Фильтры</SheetTitle>
			</SheetHeader>
			<FilterPanel status={status} type={type} onStatusChange={onStatusChange} onTypeChange={onTypeChange} onReset={onReset} />
		</SheetContent>
	</Sheet>
)
