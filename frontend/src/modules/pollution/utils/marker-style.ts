import {PollutionType} from '../domain/pollution.model'

const typeColors: Record<string, string> = {
	[PollutionType.TRASH]: '#ef4444',
	[PollutionType.OIL_SPILL]: '#111827',
	[PollutionType.INDUSTRIAL_WASTE]: '#f59e0b',
	[PollutionType.SEWAGE]: '#2563eb',
	[PollutionType.PLASTIC]: '#10b981',
}

export const getMarkerColor = (type: PollutionType | string) =>
	typeColors[type] ?? '#6b7280'

export const getMarkerIcon = (type: PollutionType | string) => {
	switch (type) {
		case PollutionType.TRASH:
		case 'trash':
			return '🗑️'
		case PollutionType.OIL_SPILL:
		case 'oil_spill':
			return '🛢️'
		case PollutionType.INDUSTRIAL_WASTE:
		case 'industrial_waste':
			return '🏭'
		case PollutionType.SEWAGE:
		case 'sewage':
			return '💧'
		case PollutionType.PLASTIC:
		case 'plastic':
			return '♻️'
		default:
			return '⚠️'
	}
}
