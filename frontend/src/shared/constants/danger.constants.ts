export const DANGER_COLORS = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
} as const

export const DANGER_LABELS = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
} as const

export type DangerLevel = keyof typeof DANGER_LABELS
