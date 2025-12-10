import { PollutionStatus, PollutionType } from '@/shared/types'

export const getMarkerColor = (status: PollutionStatus): string => {
  switch (status) {
    case PollutionStatus.REPORTED:
      return '#ef4444'
    case PollutionStatus.IN_PROGRESS:
      return '#f59e0b'
    case PollutionStatus.CLEANED:
      return '#10b981'
    case PollutionStatus.VERIFIED:
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

export const getMarkerIcon = (type: PollutionType | string): string => {
  // Handle both enum and string types
  const typeStr = typeof type === 'string' ? type.toLowerCase() : type
  
  switch (typeStr) {
    case PollutionType.TRASH:
    case 'trash':
    case 'мусор':
      return '🗑️'
    case PollutionType.OIL_SPILL:
    case 'oil_spill':
    case 'нефть':
      return '🛢️'
    case PollutionType.INDUSTRIAL_WASTE:
    case 'industrial_waste':
    case 'промышленные отходы':
      return '🏭'
    case PollutionType.SEWAGE:
    case 'sewage':
    case 'сточные воды':
      return '💧'
    case PollutionType.PLASTIC:
    case 'plastic':
    case 'пластик':
      return '♻️'
    default:
      return '⚠️'
  }
}

export const getStatusColor = (status: PollutionStatus): string => {
  const colors = {
    [PollutionStatus.REPORTED]: 'bg-red-500',
    [PollutionStatus.IN_PROGRESS]: 'bg-yellow-500',
    [PollutionStatus.CLEANED]: 'bg-green-500',
    [PollutionStatus.VERIFIED]: 'bg-blue-500',
  }
  return colors[status] || 'bg-gray-500'
}
