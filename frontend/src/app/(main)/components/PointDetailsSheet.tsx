import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/Sheet'
import { PointDetails } from '@/shared/components/pollution/PointDetails'
import { PollutionPoint, PollutionStatus, UserRole } from '@/shared/types'

interface PointDetailsSheetProps {
  point: PollutionPoint | null
  userRole?: UserRole
  onClose: () => void
  onStatusChange: (status: PollutionStatus) => void
  onDelete: () => void
}

export function PointDetailsSheet({
  point,
  userRole,
  onClose,
  onStatusChange,
  onDelete,
}: PointDetailsSheetProps) {
  return (
    <Sheet open={!!point} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pollution Details</SheetTitle>
        </SheetHeader>
        {point && (
          <PointDetails
            point={point}
            userRole={userRole}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
