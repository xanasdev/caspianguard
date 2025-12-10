import * as z from 'zod'

export const reportPollutionSchema = z.object({
	type: z.string().min(1, 'Выберите тип загрязнения'),
	description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
	region: z.string().optional(),
})

export type ReportPollutionFormData = z.infer<typeof reportPollutionSchema>
