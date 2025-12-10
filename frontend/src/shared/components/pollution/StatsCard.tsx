'use client'

import { PollutionStats } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'
import styles from '@/shared/styles/card.module.css'

interface StatsCardProps {
  stats?: PollutionStats
}

export function StatsCard({ stats }: StatsCardProps) {
  if (!stats) return null

  return (
    <div className={styles.statsGrid}>
      <Card className={styles.statCard}>
        <p className={styles.statLabel}>Total Reports</p>
        <p className={styles.statValue}>{stats.total}</p>
      </Card>
      
      <Card className={styles.statCard}>
        <p className={styles.statLabel}>Reported</p>
        <p className={`${styles.statValue} ${styles.statValueRed}`}>{stats.reported}</p>
      </Card>
      
      <Card className={styles.statCard}>
        <p className={styles.statLabel}>In Progress</p>
        <p className={`${styles.statValue} ${styles.statValueYellow}`}>{stats.inProgress}</p>
      </Card>
      
      <Card className={styles.statCard}>
        <p className={styles.statLabel}>Cleaned</p>
        <p className={`${styles.statValue} ${styles.statValueGreen}`}>{stats.cleaned}</p>
      </Card>
    </div>
  )
}
