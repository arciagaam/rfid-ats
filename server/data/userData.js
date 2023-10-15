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
        birthdate: '1995-01-01',
    },
    {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Doe',
        email: 'john@email.com',
        password: defaultPassword,
        role: 'faculty',
        department: 'it',
        status: 'not registered',
        birthdate: '1995-01-01',
        idNumber: '123456789',
        rfid: 'SOME_RFID_NUMBER',
        sex: 'Male',
        contactNumber: '09123456789',
        address: '123 Street, City, Province, Country',
    },
    {
        firstName: 'Jane',
        middleName: 'Michaela',
        lastName: 'Doe',
        email: 'jane@email.com',
        password: defaultPassword,
        role: 'faculty',
        department: 'it',
        status: 'not registered',
        birthdate: '1995-01-01',
        idNumber: '123456789',
        rfid: 'SOME_RFID_NUMBER',
        sex: 'Female',
        contactNumber: '09123456789',
        address: '123 Street, City, Province, Country',
    },
    {
        firstName: 'Emily',
        middleName: 'Anne',
        lastName: 'Smith',
        email: 'emily@email.com',
        password: defaultPassword,
        role: 'faculty',
        department: 'it',
        status: 'not registered',
        birthdate: '1995-01-01',
        idNumber: '123456789',
        rfid: 'SOME_RFID_NUMBER',
        sex: 'Female',
        contactNumber: '09123456789',
        address: '123 Street, City, Province, Country',
    },
    {
        firstName: 'Andrew',
        middleName: 'Charles',
        lastName: 'Hall',
        email: 'andrew@email.com',
        password: defaultPassword,
        role: 'faculty',
        department: 'it',
        status: 'not registered',
        birthdate: '1995-01-01',
        idNumber: '123456789',
        rfid: 'SOME_RFID_NUMBER',
        sex: 'Male',
        contactNumber: '09123456789',
        address: '123 Street, City, Province, Country',
    },
]

export default users
