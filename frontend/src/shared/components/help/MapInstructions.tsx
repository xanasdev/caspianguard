import { Info, MapPin, Filter, Plus } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import styles from '@/shared/styles/help.module.css'

interface MapInstructionsProps {
  onClose: () => void
}

export function MapInstructions({ onClose }: MapInstructionsProps) {
  return (
    <Card className={styles.instructionsCard}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Info className="h-5 w-5" />
          <h3 className={styles.title}>How to Use the Map</h3>
        </div>
        <button onClick={onClose} className={styles.closeButton}>×</button>
      </div>

      <div className={styles.content}>
        <div className={styles.instruction}>
          <MapPin className="h-4 w-4 text-blue-500" />
          <div>
            <p className={styles.instructionTitle}>Click on Map</p>
            <p className={styles.instructionText}>Click anywhere on the map to report a new pollution point</p>
          </div>
        </div>

        <div className={styles.instruction}>
          <Plus className="h-4 w-4 text-green-500" />
          <div>
            <p className={styles.instructionTitle}>Report Button</p>
            <p className={styles.instructionText}>Use the Report button to add pollution without clicking the map</p>
          </div>
        </div>

        <div className={styles.instruction}>
          <Filter className="h-4 w-4 text-purple-500" />
          <div>
            <p className={styles.instructionTitle}>Filter Points</p>
            <p className={styles.instructionText}>Use filters to view specific types or statuses of pollution</p>
          </div>
        </div>

        <div className={styles.legend}>
          <p className={styles.legendTitle}>Marker Colors:</p>
          <div className={styles.legendItems}>
            <span className={styles.legendItem}>🔴 Reported</span>
            <span className={styles.legendItem}>🟡 In Progress</span>
            <span className={styles.legendItem}>🟢 Cleaned</span>
            <span className={styles.legendItem}>🔵 Verified</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
