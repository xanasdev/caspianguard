export enum PollutionStatus {
	REPORTED = 'REPORTED',
	IN_PROGRESS = 'IN_PROGRESS',
	CLEANED = 'CLEANED',
	VERIFIED = 'VERIFIED',
}

export enum PollutionType {
	TRASH = 'trash',
	OIL_SPILL = 'oil_spill',
	INDUSTRIAL_WASTE = 'industrial_waste',
	SEWAGE = 'sewage',
	PLASTIC = 'plastic',
	OTHER = 'other',
}

export interface PollutionTypeModel {
	id: number
	name: string
	description?: string
}

export interface MarkerPhoto {
	id: number
	image: string
	uploaded_at: string
}

export interface Marker {
	id: number
	latitude: string
	longitude: string
	description: string
	region_type: string | null
	pollution_type: PollutionTypeModel
	status?: PollutionStatus
	photos?: MarkerPhoto[]
	created_at: string
	creator?: number | null
	creator_username?: string | null
}

export interface PollutionStats {
	total: number
	reported: number
	inProgress: number
	cleaned: number
	byType: Record<string, number>
	byRegion: Record<string, number>
}

export interface StatusStats {
	in_progress: number
	cleared: number
}

export interface MarkerFilters {
	pollution_type?: number
	region_type?: string
	search?: string
	status?: PollutionStatus
	type?: PollutionType | string
}

export interface CreateMarkerPayload {
	latitude: string
	longitude: string
	description: string
	region_type?: string
	pollution_type_name: PollutionType | string
	photos?: File[]
	phone_number?: string
}

export interface UpdateMarkerPayload {
	latitude?: string
	longitude?: string
	description?: string
	region_type?: string
	pollution_type_name?: PollutionType | string
	status?: PollutionStatus
	photos?: File[]
}
