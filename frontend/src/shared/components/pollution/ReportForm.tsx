import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportPollutionSchema, ReportPollutionFormData } from '@/shared/schemas/pollution.schema'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Textarea } from '@/shared/components/ui/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select'
import { PollutionType } from '@/shared/types'
import { Upload } from 'lucide-react'
import styles from '@/shared/styles/form.module.css'

interface ReportFormProps {
  latitude: number
  longitude: number
  onSubmit: (data: ReportPollutionFormData & { photos: File[] }) => void
  isLoading?: boolean
}

export function ReportForm({
  latitude,
  longitude,
  onSubmit,
  isLoading,
}: ReportFormProps) {
  const [photos, setPhotos] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReportPollutionFormData>({
    resolver: zodResolver(reportPollutionSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const onFormSubmit = (data: ReportPollutionFormData) => {
    onSubmit({ ...data, photos })
  }

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
			<div className={styles.formGroup}>
				<Label>Location</Label>
				<p className={styles.mutedText}>
					Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
				</p>
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='type'>Pollution Type</Label>
				<Select
					onValueChange={(value) => setValue('type', value as PollutionType)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Select type' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={PollutionType.TRASH}>Trash</SelectItem>
						<SelectItem value={PollutionType.OIL_SPILL}>Oil Spill</SelectItem>
						<SelectItem value={PollutionType.INDUSTRIAL_WASTE}>
							Industrial Waste
						</SelectItem>
						<SelectItem value={PollutionType.SEWAGE}>Sewage</SelectItem>
						<SelectItem value={PollutionType.PLASTIC}>Plastic</SelectItem>
						<SelectItem value={PollutionType.OTHER}>Other</SelectItem>
					</SelectContent>
				</Select>
				{errors.type && (
					<p className={styles.errorText}>{errors.type.message}</p>
				)}
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					{...register('description')}
					placeholder='Describe the pollution...'
				/>
				{errors.description && (
					<p className={styles.errorText}>{errors.description.message}</p>
				)}
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='region'>Region (Optional)</Label>
				<Input {...register('region')} placeholder='e.g., Aktau, Makhachkala' />
			</div>

			<div className={styles.formGroup}>
				<Label htmlFor='photos'>Photos</Label>
				<div className={styles.fileInput}>
					<Input
						id='photos'
						type='file'
						multiple
						accept='image/*'
						onChange={handleFileChange}
					/>
					<Upload className='h-4 w-4' />
				</div>
				{photos.length > 0 && (
					<p className={styles.mutedText}>{photos.length} file(s) selected</p>
				)}
			</div>

			<Button type='submit' disabled={isLoading} className='w-full'>
				{isLoading ? 'Submitting...' : 'Report Pollution'}
			</Button>
		</form>
	)
}
