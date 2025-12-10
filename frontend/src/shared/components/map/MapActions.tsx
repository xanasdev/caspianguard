import { Button } from '@/shared/components/ui/Button'
import { Plus, Filter } from 'lucide-react'

interface MapActionsProps {
  onReportClick: () => void
  onFilterClick: () => void
}

export function MapActions({ onReportClick, onFilterClick }: MapActionsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onFilterClick}>
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
      <Button onClick={onReportClick}>
        <Plus className="h-4 w-4 mr-2" />
        Report
      </Button>
    </div>
  )
}
