import { ZodSchema, z } from 'zod'

export const registerSchema = z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.string(),
    status: z.string(),
    department: z.string().optional(),
    idNumber: z.string().optional(),
    rfid: z.string().optional(),
    birthdate: z.date().optional(),
    sex: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
}).superRefine((schema, refinementContext) => {
    const {
        role,
        contactNumber,
    } = schema;

    if (role !== 'admin') {

        if (!(/^[1-9][0-9]{9}$/).test(contactNumber ?? '')) {
            refinementContext.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid format',
                path: ['contactNumber']
            });
        }

        for(const name in schema) {
            if (name == 'rfid') continue;

            const def: keyof typeof schema = name;

            if(!schema[def]) {
                refinementContext.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `The ${name} field is required`,
                    path: [...refinementContext.path, name]
                });
            }
        }
    }

    return true;
})
