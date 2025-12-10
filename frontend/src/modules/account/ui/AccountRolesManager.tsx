import {
	useCreateRole,
	useDeleteRole,
	useRoles,
	useUpdateRole,
} from '@/modules/auth'
import {Role, RolePermission} from '@/modules/auth/domain/role.model'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/Card'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/Dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/Form'
import {Input} from '@/shared/components/ui/Input'
import {Textarea} from '@/shared/components/ui/Textarea'
import styles from '@/shared/styles/account-page.module.css'
import {zodResolver} from '@hookform/resolvers/zod'
import {useTranslations} from 'next-intl'
import {useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import {z} from 'zod'

const roleSchema = z.object({
	name: z.string().min(2, 'Введите название роли'),
	description: z.string().max(300).optional().or(z.literal('')),
	permissions: z.string().optional().or(z.literal('')),
})

type RoleFormValues = z.infer<typeof roleSchema>

const parsePermissions = (value?: string): RolePermission[] => {
	if (!value) return []
	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item): item is RolePermission => item.length > 0)
}

interface AccountRolesManagerProps {
	canManage: boolean
}

const toPermissionArray = (value: Role['permissions']): RolePermission[] => {
	if (Array.isArray(value)) return value as RolePermission[]
	if (typeof value === 'string') return parsePermissions(value)
	return []
}

export const AccountRolesManager = ({canManage}: AccountRolesManagerProps) => {
	const t = useTranslations('admin.roles')
	const tCommon = useTranslations('common')
	const {data: roles = [], isLoading, isError} = useRoles({enabled: canManage})
	const createRole = useCreateRole()
	const updateRole = useUpdateRole()
	const deleteRole = useDeleteRole()
	const [editingRole, setEditingRole] = useState<Role | null>(null)
	const canEdit = canManage && !isError

	const createForm = useForm<RoleFormValues>({
		resolver: zodResolver(roleSchema),
		defaultValues: {name: '', description: '', permissions: ''},
	})

	const editForm = useForm<RoleFormValues>({
		resolver: zodResolver(roleSchema),
	})

	const onCreate = (values: RoleFormValues) => {
		if (!canEdit) return
		createRole.mutate(
			{
				name: values.name,
				description: values.description || undefined,
				permissions: parsePermissions(values.permissions),
			},
			{
				onSuccess: () => {
					toast.success('Роль создана')
					createForm.reset({name: '', description: '', permissions: ''})
				},
				onError: () => toast.error('Не удалось создать роль'),
			},
		)
	}

	const openEdit = (role: Role) => {
		setEditingRole(role)
		editForm.reset({
			name: role.name,
			description: role.description ?? '',
			permissions: toPermissionArray(role.permissions).join(', '),
		})
	}

	const onUpdate = (values: RoleFormValues) => {
		if (!canEdit || !editingRole) return
		if (!editingRole) return
		updateRole.mutate(
			{
				id: editingRole.id,
				payload: {
					name: values.name,
					description: values.description || undefined,
					permissions: parsePermissions(values.permissions),
				},
			},
			{
				onSuccess: () => {
					toast.success('Роль обновлена')
					setEditingRole(null)
				},
				onError: () => toast.error('Не удалось обновить роль'),
			},
		)
	}

	const onDelete = (role: Role) => {
		if (!canEdit) return
		deleteRole.mutate(role.id, {
			onSuccess: () => toast.success('Роль удалена'),
			onError: () => toast.error('Не удалось удалить роль'),
		})
	}

	const sortedRoles = useMemo(
		() => roles.slice().sort((a, b) => a.name.localeCompare(b.name)),
		[roles],
	)

	if (!canManage) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className={styles.sectionTitle}>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>
			<CardContent className={styles.adminSection}>
				<Form {...createForm}>
					<form
						onSubmit={createForm.handleSubmit(onCreate)}
						className={styles.cardContent}
					>
						<FormField
							control={createForm.control}
							name='name'
							render={({field}) => (
								<FormItem>
									<FormLabel>{t('name')}</FormLabel>
									<FormControl>
										<Input placeholder='Например, ADMIN' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={createForm.control}
							name='description'
							render={({field}) => (
								<FormItem>
									<FormLabel>{t('descriptionInput')}</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Для чего предназначена роль'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={createForm.control}
							name='permissions'
							render={({field}) => (
								<FormItem>
									<FormLabel>{t('permissions')}</FormLabel>
									<FormControl>
										<Input
											placeholder='admin_access, manager_access'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' disabled={createRole.isPending}>
							{t('create')}
						</Button>
					</form>
				</Form>

				<div className={styles.roleList}>
					{isLoading && (
						<p className='text-sm text-muted-foreground'>
							{tCommon('loading')}
						</p>
					)}
					{isError && (
						<p className='text-sm text-destructive'>
							Нет доступа к списку ролей.
						</p>
					)}
					{!isLoading && !isError && sortedRoles.length === 0 && (
						<p className='text-sm text-muted-foreground'>{t('empty')}</p>
					)}
					{!isError &&
						sortedRoles.map((role) => {
							const permissionList = toPermissionArray(role.permissions)
							return (
								<div key={role.id} className={styles.roleItem}>
									<div>
										<p className='text-sm font-semibold uppercase tracking-wide'>
											{role.name}
										</p>
										<p className='text-sm text-muted-foreground'>
											{role.description || 'Без описания'}
										</p>
									</div>
									<div className={styles.roleActions}>
										{permissionList.length === 0 && (
											<Badge variant='outline'>Права не назначены</Badge>
										)}
										{permissionList.map((perm) => (
											<Badge key={perm} variant='outline'>
												{perm}
											</Badge>
										))}
									</div>
									<div className='flex gap-2'>
										<Dialog
											open={editingRole?.id === role.id}
											onOpenChange={(open) =>
												!open ? setEditingRole(null) : openEdit(role)
											}
										>
											<DialogTrigger asChild>
												<Button
													variant='outline'
													size='sm'
													onClick={() => openEdit(role)}
												>
													{tCommon('edit')}
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Редактирование роли</DialogTitle>
												</DialogHeader>
												<Form {...editForm}>
													<form
														onSubmit={editForm.handleSubmit(onUpdate)}
														className='space-y-4'
													>
														<FormField
															control={editForm.control}
															name='name'
															render={({field}) => (
																<FormItem>
																	<FormLabel>{t('name')}</FormLabel>
																	<FormControl>
																		<Input {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={editForm.control}
															name='description'
															render={({field}) => (
																<FormItem>
																	<FormLabel>{t('descriptionInput')}</FormLabel>
																	<FormControl>
																		<Textarea {...field} />
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={editForm.control}
															name='permissions'
															render={({field}) => (
																<FormItem>
																	<FormLabel>{t('permissions')}</FormLabel>
																	<FormControl>
																		<Input
																			placeholder='admin_access, manager_access'
																			{...field}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<DialogFooter className='flex justify-end gap-2'>
															<Button
																type='button'
																variant='outline'
																onClick={() => setEditingRole(null)}
															>
																{tCommon('cancel')}
															</Button>
															<Button
																type='submit'
																disabled={updateRole.isPending}
															>
																{tCommon('save')}
															</Button>
														</DialogFooter>
													</form>
												</Form>
											</DialogContent>
										</Dialog>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => onDelete(role)}
											disabled={deleteRole.isPending}
										>
											{tCommon('delete')}
										</Button>
									</div>
								</div>
							)
						})}
				</div>
			</CardContent>
		</Card>
	)
}
