import { PollutionStats } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'

interface StatsOverlayProps {
  stats?: PollutionStats
}

export function StatsOverlay({ stats }: StatsOverlayProps) {
  if (!stats) return null

  return (
    <div style={{ 
      position: 'absolute', 
      top: '1rem', 
      left: '1rem', 
      right: '1rem', 
      zIndex: 1000, 
      pointerEvents: 'none' 
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1rem', 
        pointerEvents: 'auto' 
      }}>
        <Card style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</p>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reported</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.reported}</p>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>In Progress</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.inProgress}</p>
        </Card>
        <Card style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cleaned</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.cleaned}</p>
        </Card>
      </div>
    </div>
  )
}
