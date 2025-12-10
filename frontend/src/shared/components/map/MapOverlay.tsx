'use client'

import { ReactNode } from 'react'
import styles from '@/shared/styles/map.module.css'

interface MapOverlayProps {
  children: ReactNode
  position: 'top' | 'bottom'
}

export function MapOverlay({ children, position }: MapOverlayProps) {
  const positionClass = position === 'top' ? styles.mapOverlayTop : styles.mapOverlayBottom
  
  return (
    <div className={`${styles.mapOverlay} ${positionClass}`}>
      {children}
    </div>
  )
}
