import { any, z } from 'zod'

export const accomplishmentReportSchema = z.object({
        title: z.string(),
        users: z.array(any()),
        deadline: z.date(),
        type: z.string().optional().nullable()
    })
    .required()
