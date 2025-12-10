import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/Dialog'
import { ReportForm } from '@/shared/components/pollution/ReportForm'
import { PollutionType } from '@/shared/types'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coords: [number, number] | null
  onSubmit: (data: { type: PollutionType; description: string; photos: File[]; region?: string }) => void
  isLoading: boolean
}

export function ReportDialog({ open, onOpenChange, coords, onSubmit, isLoading }: ReportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Pollution</DialogTitle>
        </DialogHeader>
        {coords && (
          <ReportForm
            latitude={coords[0]}
            longitude={coords[1]}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
