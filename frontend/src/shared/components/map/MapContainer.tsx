'use client'

import { YMaps, Map } from '@pbe/react-yandex-maps'
import { ReactNode } from 'react'

interface MapContainerProps {
  children?: ReactNode
  center?: [number, number]
  zoom?: number
  onClick?: (coords: [number, number]) => void
}

interface YandexMapEvent {
  get: (key: string) => unknown
}

export function MapContainer({
  children,
  center = [42.8746, 47.6248],
  zoom = 10,
  onClick,
}: MapContainerProps) {
  const handleClick = (e: YandexMapEvent) => {
    const coords = e.get('coords') as [number, number]
    onClick?.(coords)
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY, lang: 'en_US' }}>
        <Map
          defaultState={{ center, zoom }}
          width="100%"
          height="100%"
          onClick={handleClick}
        >
          {children}
        </Map>
      </YMaps>
    </div>
  )
}
