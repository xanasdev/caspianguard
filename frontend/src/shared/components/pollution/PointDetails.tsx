import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/shared/components/ui/Avatar'
import {Badge} from '@/shared/components/ui/Badge'
import {Button} from '@/shared/components/ui/Button'
import {Card} from '@/shared/components/ui/Card'
import {PollutionPoint, PollutionStatus, UserRole} from '@/shared/types'
import {format} from 'date-fns'
import Image from 'next/image'

interface PointDetailsProps {
	point: PollutionPoint
	userRole?: UserRole
	onStatusChange?: (status: PollutionStatus) => void
	onDelete?: () => void
}

const statusColors = {
	[PollutionStatus.REPORTED]: 'bg-red-500',
	[PollutionStatus.IN_PROGRESS]: 'bg-yellow-500',
	[PollutionStatus.CLEANED]: 'bg-green-500',
	[PollutionStatus.VERIFIED]: 'bg-blue-500',
}

export function PointDetails({
	point,
	userRole,
	onStatusChange,
	onDelete,
}: PointDetailsProps) {
	const canManage =
		userRole === UserRole.ACTIVIST || userRole === UserRole.ADMIN

	return (
		<Card className='p-4 space-y-4'>
			<div className='flex items-start justify-between'>
				<div>
					<h3 className='font-semibold text-lg'>{point.type}</h3>
					<Badge className={statusColors[point.status]}>{point.status}</Badge>
				</div>
				{point.photos.length > 0 && (
					<Image
						src={point.photos[0]}
						alt='Pollution'
						width={80}
						height={80}
						className='w-20 h-20 rounded object-cover'
					/>
				)}
			</div>

			<p className='text-sm text-muted-foreground'>{point.description}</p>

			<div className='flex items-center gap-2'>
				<Avatar className='h-8 w-8'>
					<AvatarImage src={point.reportedBy.avatar} />
					<AvatarFallback>{point.reportedBy.name[0]}</AvatarFallback>
				</Avatar>
				<div className='text-sm'>
					<p className='font-medium'>{point.reportedBy.name}</p>
					<p className='text-muted-foreground'>
						{format(new Date(point.createdAt), 'MMM d, yyyy')}
					</p>
				</div>
			</div>

			{point.region && (
				<p className='text-sm'>
					<span className='font-medium'>Region:</span> {point.region}
				</p>
			)}

			{canManage && (
				<div className='flex gap-2 pt-2 border-t'>
					{point.status !== PollutionStatus.IN_PROGRESS && (
						<Button
							size='sm'
							variant='outline'
							onClick={() => onStatusChange?.(PollutionStatus.IN_PROGRESS)}
						>
							Mark In Progress
						</Button>
					)}
					{point.status !== PollutionStatus.CLEANED && (
						<Button
							size='sm'
							variant='outline'
							onClick={() => onStatusChange?.(PollutionStatus.CLEANED)}
						>
							Mark Cleaned
						</Button>
					)}
					{userRole === UserRole.ADMIN && (
						<Button size='sm' variant='destructive' onClick={onDelete}>
							Delete
						</Button>
					)}
				</div>
			)}
		</Card>
	)
}
