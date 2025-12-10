import {httpClient} from '@/shared/api/http.client'
import {
	CreateMarkerPayload,
	Marker,
	MarkerFilters,
	PollutionStats,
	PollutionStatus,
	PollutionTypeModel,
	UpdateMarkerPayload,
} from '../domain/pollution.model'
import {buildPollutionStats} from '../utils/stats'
import {markersToCSV} from '../utils/report'

const PollutionEndpoints = {
	markers: '/pollutions/',
	marker: (id: number) => `/pollutions/${id}/`,
	types: '/pollution-types/',
} as const

// Backend response type for paginated results
interface PaginatedResponse<T> {
	count: number
	next: string | null
	previous: string | null
	results: T[]
}

// Backend pollution data structure
interface BackendPollution {
	id: number
	latitude: number
	longitude: number
	description: string
	pollution_type: {id: number; name: string} // Backend now returns object
	created_at: string
	reported_by: number | null
	is_approved: boolean
	image_url: string | null
	phone_number: string | null
}

// Transform backend response to frontend Marker format
const transformBackendToMarker = (data: BackendPollution): Marker => ({
	id: data.id,
	latitude: String(data.latitude),
	longitude: String(data.longitude),
	description: data.description,
	region_type: null,
	pollution_type: data.pollution_type,
	status: data.is_approved ? PollutionStatus.VERIFIED : PollutionStatus.REPORTED,
	photos: data.image_url ? [{id: 0, image: data.image_url, uploaded_at: data.created_at}] : [],
	created_at: data.created_at,
	creator: data.reported_by,
	creator_username: null,
})

const buildCreateFormData = (payload: CreateMarkerPayload) => {
	const formData = new FormData()
	formData.append('latitude', payload.latitude)
	formData.append('longitude', payload.longitude)
	formData.append('description', payload.description)
	// Backend uses 'pollution_type_name' field for writing (SlugRelatedField expects name string)
	formData.append('pollution_type_name', payload.pollution_type_name)
	// Backend expects single 'image' field
	if (payload.photos && payload.photos.length > 0) {
		formData.append('image', payload.photos[0])
	}
	if (payload.phone_number) {
		formData.append('phone_number', payload.phone_number)
	}
	return formData
}

export const pollutionApi = {
	async getAll(params?: MarkerFilters): Promise<Marker[]> {
		const query: Record<string, unknown> = {}
		if (params?.pollution_type) query.pollution_type = params.pollution_type
		if (params?.region_type) query.region_type = params.region_type
		if (params?.search) query.search = params.search
		if (params?.status) query.status = params.status
		if (params?.type) query.pollution_type = params.type
		// Request large page size to get all results
		query.page_size = 100
		
		const {data} = await httpClient.get<PaginatedResponse<BackendPollution>>(
			PollutionEndpoints.markers,
			{params: Object.keys(query).length ? query : undefined}
		)
		
		// Transform backend response to frontend Marker format
		return data.results.map(transformBackendToMarker)
	},

	async getById(id: number): Promise<Marker> {
		const {data} = await httpClient.get<BackendPollution>(PollutionEndpoints.marker(id))
		return transformBackendToMarker(data)
	},

	async create(payload: CreateMarkerPayload): Promise<Marker> {
		const formData = buildCreateFormData(payload)
		const {data} = await httpClient.post<BackendPollution>(PollutionEndpoints.markers, formData, {
			headers: {'Content-Type': 'multipart/form-data'},
		})
		return transformBackendToMarker(data)
	},

	async update(id: number, payload: UpdateMarkerPayload): Promise<Marker> {
		const {data} = await httpClient.put<BackendPollution>(PollutionEndpoints.marker(id), payload)
		return transformBackendToMarker(data)
	},

	async patch(id: number, payload: Partial<UpdateMarkerPayload>): Promise<Marker> {
		const {data} = await httpClient.patch<BackendPollution>(PollutionEndpoints.marker(id), payload)
		return transformBackendToMarker(data)
	},

	async delete(id: number): Promise<void> {
		await httpClient.delete(PollutionEndpoints.marker(id))
	},

	async getPollutionTypes(): Promise<PollutionTypeModel[]> {
		const {data} = await httpClient.get<PollutionTypeModel[]>(PollutionEndpoints.types)
		return data
	},

	async getStats(params?: MarkerFilters): Promise<PollutionStats> {
		const markers = await this.getAll(params)
		return buildPollutionStats(markers)
	},

	async exportReport(params?: MarkerFilters): Promise<Blob> {
		const markers = await this.getAll(params)
		const csv = markersToCSV(markers)
		return new Blob([csv], {type: 'text/csv'})
	},
}
