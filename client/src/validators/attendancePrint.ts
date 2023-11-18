import { z } from 'zod'

export const attendancePrintSchema = z.object({
    date: z.date()
}).required();
