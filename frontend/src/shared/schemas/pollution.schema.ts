import * as z from 'zod'
import { PollutionType } from '@/shared/types'

export const reportPollutionSchema = z.object({
  type: z.nativeEnum(PollutionType),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  region: z.string().optional(),
})

export type ReportPollutionFormData = z.infer<typeof reportPollutionSchema>
