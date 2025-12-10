import { ReactNode } from 'react'
import { Map } from '@pbe/react-yandex-maps'
import { YandexMapEvent } from '@/shared/interfaces/map.interface'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/shared/constants/map.constants'

interface YandexMapViewProps {
  children: ReactNode
  onMapClick: (e: YandexMapEvent) => void
}

export function YandexMapView({ children, onMapClick }: YandexMapViewProps) {
  return (
    <Map
      defaultState={{ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM }}
      width="100%"
      height="100%"
      onClick={onMapClick}
    >
      {children}
    </Map>
  )
}
