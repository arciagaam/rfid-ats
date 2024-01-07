import { z } from 'zod'

export const attendancePrintSchema = z.object({
    dateFrom: z.date(),
    dateTo: z.date()
}).required();
