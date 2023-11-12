import { z } from 'zod'

export const accomplishmentReportSchema = z.object({
        title: z.string(),
        file: z.any().optional().nullable(),
        link: z.any().nullable(),
        type: z.string().optional().nullable()
    });
