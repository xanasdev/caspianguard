import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/Sheet'
import { FilterPanel } from '@/shared/components/pollution/FilterPanel'
import { PollutionStatus, PollutionType } from '@/shared/types'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  status?: PollutionStatus
  type?: PollutionType
  onStatusChange: (status?: PollutionStatus) => void
  onTypeChange: (type?: PollutionType) => void
  onReset: () => void
}

export function FilterDrawer({
  open,
  onOpenChange,
  status,
  type,
  onStatusChange,
  onTypeChange,
  onReset,
}: FilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Points</SheetTitle>
        </SheetHeader>
        <FilterPanel
          status={status}
          type={type}
          onStatusChange={onStatusChange}
          onTypeChange={onTypeChange}
          onReset={onReset}
        />
      </SheetContent>
    </Sheet>
  )
}
