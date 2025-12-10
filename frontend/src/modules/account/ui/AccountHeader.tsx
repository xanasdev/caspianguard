import {AuthUser} from '@/modules/auth'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/shared/components/ui/Avatar'
import {Badge} from '@/shared/components/ui/Badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/Card'
import {useTranslations} from 'next-intl'

interface AccountHeaderProps {
	user: AuthUser
}

export const AccountHeader = ({user}: AccountHeaderProps) => {
	const t = useTranslations('account')
	const initials = user.name
		? user.name.slice(0, 2).toUpperCase()
		: user.username.slice(0, 2).toUpperCase()
	const roleLabel = user.role_name ?? 'CITIZEN'

	return (
		<Card>
			<CardHeader className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-4'>
					<Avatar className='h-14 w-14 rounded-xl border border-border'>
						<AvatarImage src={user.avatar ?? undefined} alt={user.username} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className='space-y-1'>
						<CardTitle className='text-2xl font-semibold tracking-tight'>
							{user.name ?? user.username}
						</CardTitle>
						<CardDescription>{user.email}</CardDescription>
					</div>
				</div>
				<Badge
					variant='outline'
					className='px-3 py-1 text-xs uppercase tracking-wide'
				>
					{roleLabel.replace(/_/g, ' ')}
				</Badge>
			</CardHeader>
			<CardContent className='grid gap-2 text-sm text-muted-foreground'>
				<span>{t('title')}</span>
			</CardContent>
		</Card>
	)
}
