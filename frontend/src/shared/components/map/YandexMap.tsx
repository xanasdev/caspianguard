'use client'

import { Map } from '@pbe/react-yandex-maps'
import { ReactNode } from 'react'

interface YandexMapProps {
  children?: ReactNode
  center?: [number, number]
  zoom?: number
  onClick?: (coords: [number, number]) => void
}

interface YandexMapEvent {
  get: (key: string) => unknown
}

export function YandexMap({
  children,
  center = [42.8746, 47.6248],
  zoom = 10,
  onClick,
}: YandexMapProps) {
  const handleClick = (e: YandexMapEvent) => {
    const coords = e.get('coords') as [number, number]
    onClick?.(coords)
  }

  return (
    <Map
      defaultState={{ center, zoom }}
      width="100%"
      height="100%"
      onClick={handleClick}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </Map>
  )
}
