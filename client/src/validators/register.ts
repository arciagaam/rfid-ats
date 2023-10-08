import { z } from 'zod'

export const registerSchema = z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
    status: z.string(),
    idNumber: z.string().optional(),
    rfid: z.string().optional(),
    birthdate: z.date().optional(),
    sex: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
})
