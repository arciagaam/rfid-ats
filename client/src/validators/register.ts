import { z } from 'zod'

const registerSchemaBase = z.object({
    firstName: z.string().nonempty('Required'),
    middleName: z.string().optional().nullable(),
    lastName: z.string().nonempty('Required'),
    email: z.string().email().nonempty('Required'),
    password: z.string().nonempty('Required'),
    profilePicture: z.string().optional().nullable(),
})

const adminUser = z
    .object({
        role: z.literal('admin'),
        status: z.string(),
    })
    .merge(registerSchemaBase)

const facultyUser = z
    .object({
        role: z.enum(['regular', 'part-time']),
        status: z.string(),
        idNumber: z.string().nonempty('Required'),
        rfid: z.string().optional(),
        birthdate: z.date(),
        sex: z.string().nonempty('Required'),
        contactNumber: z
            .string()
            .nonempty('Required')
            .regex(new RegExp(/^9\d{9}$/))
            .max(10, 'Must be 10 digits'),
        address: z.string().nonempty('Required'),
    })
    .merge(registerSchemaBase)

export const registerSchema = z.discriminatedUnion('role', [adminUser, facultyUser])

export { adminUser, facultyUser }
