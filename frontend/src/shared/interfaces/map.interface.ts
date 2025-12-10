export type {ReportFormData as ReportData} from './components.interface'
export type {
	MapFilters,
	MapHandlers,
	MapState,
	YandexMapEvent,
} from './hooks.interface'

export interface MutationCallbacks {
	onSuccess?: () => void
	onError?: () => void
}
