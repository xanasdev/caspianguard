export const DEFAULT_MAP_CENTER: [number, number] = [42.8746, 47.6248]
export const DEFAULT_MAP_ZOOM = 10

export const MAP_STYLES = {
  WRAPPER_HEIGHT: 'calc(100vh - 4rem)',
  OVERLAY_Z_INDEX: 1000,
  MAP_MIN_HEIGHT: '500px',
} as const

export const CASPIAN_REGIONS = {
  AKTAU: { coords: [43.65, 51.1667], name: 'Aktau, Kazakhstan' },
  MAKHACHKALA: { coords: [42.9849, 47.5047], name: 'Makhachkala, Russia' },
  BAKU: { coords: [40.4093, 49.8671], name: 'Baku, Azerbaijan' },
  TURKMENBASHI: { coords: [40.0225, 52.955], name: 'Turkmenbashi, Turkmenistan' },
} as const
