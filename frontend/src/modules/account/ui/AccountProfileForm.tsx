import {AuthUser, useUpdateUser} from '@/modules/auth'
import {Button} from '@/shared/components/ui/Button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/Card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/Form'
import {Input} from '@/shared/components/ui/Input'
import styles from '@/shared/styles/account-page.module.css'
import {zodResolver} from '@hookform/resolvers/zod'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'
import {z} from 'zod'

const profileSchema = z.object({
	first_name: z.string().max(120).optional().or(z.literal('')),
	last_name: z.string().max(120).optional().or(z.literal('')),
	phone: z.string().max(32).optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface AccountProfileFormProps {
	user: AuthUser
}

export const AccountProfileForm = ({user}: AccountProfileFormProps) => {
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			first_name: user.first_name ?? '',
			last_name: user.last_name ?? '',
			phone: user.phone ?? '',
		},
	})
	const updateUser = useUpdateUser()

	useEffect(() => {
		form.reset({
			first_name: user.first_name ?? '',
			last_name: user.last_name ?? '',
			phone: user.phone ?? '',
		})
	}, [user.first_name, user.last_name, user.phone, form])

	const onSubmit = (values: ProfileFormValues) => {
		updateUser.mutate(
			{
				id: user.id,
				...values,
			},
			{
				onSuccess: () => toast.success('Профиль обновлён'),
				onError: () => toast.error('Не удалось обновить профиль'),
			},
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className={styles.sectionTitle}>
					Редактирование профиля
				</CardTitle>
				<CardDescription>
					Обновите личные данные для коммуникации с командой проекта.
				</CardDescription>
			</CardHeader>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={styles.cardContent}
				>
					<CardContent className={styles.cardContent}>
						<FormField
							control={form.control}
							name='first_name'
							render={({field}) => (
								<FormItem>
									<FormLabel>Имя</FormLabel>
									<FormControl>
										<Input placeholder='Имя' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='last_name'
							render={({field}) => (
								<FormItem>
									<FormLabel>Фамилия</FormLabel>
									<FormControl>
										<Input placeholder='Фамилия' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({field}) => (
								<FormItem>
									<FormLabel>Телефон</FormLabel>
									<FormControl>
										<Input placeholder='+7 (___) ___-__-__' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => form.reset()}
							disabled={updateUser.isPending}
						>
							Сбросить
						</Button>
						<Button type='submit' disabled={updateUser.isPending}>
							{updateUser.isPending ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	)
}
