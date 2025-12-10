import { YandexMapEvent } from '@/shared/interfaces/map.interface'

export const extractCoordinates = (event: YandexMapEvent): [number, number] => {
  return event.get('coords') as [number, number]
}

export const formatCoordinates = (lat: number, lng: number, precision: number = 6): string => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`
}

export const isValidCoordinates = (coords: [number, number] | null): coords is [number, number] => {
  return coords !== null && coords.length === 2
}
