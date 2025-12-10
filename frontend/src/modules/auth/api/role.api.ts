import {httpClient} from '@/shared/api/http.client'
import {AssignRolePayload, CreateRolePayload, Role, UpdateRolePayload} from '../domain/role.model'

const RoleEndpoints = {
	roles: '/auth/roles/',
	role: (id: number) => `/auth/roles/${id}/`,
	assign: '/auth/assign-role/',
} as const

export const roleApi = {
	async getAll(): Promise<Role[]> {
		const {data} = await httpClient.get<Role[]>(RoleEndpoints.roles)
		return data
	},

	async getById(id: number): Promise<Role> {
		const {data} = await httpClient.get<Role>(RoleEndpoints.role(id))
		return data
	},

	async create(payload: CreateRolePayload): Promise<Role> {
		const {data} = await httpClient.post<Role>(RoleEndpoints.roles, payload)
		return data
	},

	async update(id: number, payload: UpdateRolePayload): Promise<Role> {
		const {data} = await httpClient.put<Role>(RoleEndpoints.role(id), payload)
		return data
	},

	async delete(id: number): Promise<void> {
		await httpClient.delete(RoleEndpoints.role(id))
	},

	async assign(payload: AssignRolePayload): Promise<void> {
		await httpClient.post(RoleEndpoints.assign, payload)
	},
}
