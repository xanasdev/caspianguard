import { ReactNode } from 'react'
import { YMaps } from '@pbe/react-yandex-maps'

interface MapWrapperProps {
  children: ReactNode
}

export function MapWrapper({ children }: MapWrapperProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY }}>
        {children}
      </YMaps>
    </div>
  )
}
