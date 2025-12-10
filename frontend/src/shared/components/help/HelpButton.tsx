import { HelpCircle } from 'lucide-react'
import styles from '@/shared/styles/help.module.css'

interface HelpButtonProps {
  onClick: () => void
}

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button onClick={onClick} className={styles.helpButton}>
      <HelpCircle className="h-4 w-4" />
      <span className={styles.helpButtonText}>How to use</span>
    </button>
  )
}
