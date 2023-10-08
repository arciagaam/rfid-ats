import bcrypt from 'bcryptjs'

const defaultPassword = await bcrypt.hash('password', 12)

const users = [
    {
        firstName: 'Admin',
        middleName: 'rfid',
        lastName: 'ats',
        email: 'admin@email.com',
        password: defaultPassword,
        role: 'admin',
        status: 'active',
    },
    {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Doe',
        email: 'john@email.com',
        password: defaultPassword,
        role: 'user',
        status: 'not registered',
    },
    {
        firstName: 'Janee',
        middleName: 'Michaela',
        lastName: 'Doe',
        email: 'jane@email.com',
        password: defaultPassword,
        role: 'user',
        status: 'not registered',
    },
]

export default users
