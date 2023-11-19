import bcrypt from 'bcryptjs'

const defaultPassword = await bcrypt.hash('password', 12)

const users = [
    {
        firstName: 'CCSFn',
        middleName: 'CCSMn',
        lastName: 'CCSln',
        email: 'ccsadmin@email.com',
        password: defaultPassword,
        role: 'admin',
        department: 'ccs',
        status: 'active',
        birthdate: '1995-01-01',
    },
    {
        firstName: 'COEfn',
        middleName: 'COEMn',
        lastName: 'COEln',
        email: 'coeadmin@email.com',
        password: defaultPassword,
        role: 'admin',
        department: 'coe',
        status: 'active',
        birthdate: '1995-01-01',
    },
]

export default users
