export interface PollutionTypeModel {
	id: number
	name: string
	description: string
}

export enum PollutionType {
	TRASH = 'trash',
	OIL_SPILL = 'oil_spill',
	INDUSTRIAL_WASTE = 'industrial_waste',
	SEWAGE = 'sewage',
	PLASTIC = 'plastic',
	OTHER = 'other',
}

export interface MarkerPhoto {
	id: number
	image_path: string
	uploaded_at: string
}

export interface Marker {
	id: number
	latitude: string
	longitude: string
	description: string
	region_type: string
	pollution_type: PollutionTypeModel
	photos: MarkerPhoto[]
	created_at: string
}

export interface Role {
	id: number
	name: string
	description: string
	permissions: string[]
}

export interface User {
	id: number
	username: string
	email: string
	first_name: string
	last_name: string
	phone: string
	role: number | null
	role_name?: string
	name?: string // Computed field: first_name + last_name
	avatar?: string
}

export interface AuthTokens {
	access: string
	refresh: string
}

// Legacy types for compatibility
export type PollutionPoint = Marker
export enum PollutionStatus {
	REPORTED = 'REPORTED',
	IN_PROGRESS = 'IN_PROGRESS',
	CLEANED = 'CLEANED',
	VERIFIED = 'VERIFIED',
}
export enum UserRole {
	CITIZEN = 'CITIZEN',
	ACTIVIST = 'ACTIVIST',
	ADMIN = 'ADMIN',
}

export interface PollutionStats {
	total: number
	reported: number
	inProgress: number
	cleaned: number
	byType: Record<PollutionType, number>
	byRegion: Record<string, number>
}

export interface StatusStats {
	in_progress: number
	cleared: number
}

export interface CreatePollutionPointDto {
	latitude: number
	longitude: number
	type: PollutionType
	description: string
	photos: File[]
	region?: string
}

export interface UpdatePollutionPointDto {
	status?: PollutionStatus
	assignedTo?: string
	description?: string
}
