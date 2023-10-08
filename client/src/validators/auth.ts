import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
}).required();

export const registerSchema = z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.string(),
    idNumber: z.string().optional(),
    rfid: z.string().optional(),
    birthday: z.date().optional(),
    sex: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
});
