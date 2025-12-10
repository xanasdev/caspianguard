import { ReactNode } from 'react'
import { Card } from '@/shared/components/ui/Card'
import styles from '@/shared/styles/auth.module.css'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className={styles.container}>
      <Card className={`${styles.card} page-transition-scale`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
      </Card>
    </div>
  )
}
