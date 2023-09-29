import dotenv from 'dotenv'
import connectDB from '../db/connect.js'
import colors from 'colors'

import bcrypt from 'bcrypt'
import User from './../models/User.js'

const UserSeeder = async () => {
    const args = process.argv.slice(2)
    const defaultPassword = await bcrypt.hash('password', 12)

    const users = [
        {
            firstName: 'Admin',
            middleName: 'rfid',
            lastName: 'ats',
            email: 'admin@email.com',
            password: defaultPassword,
            role: 'admin',
        },
        {
            firstName: 'John',
            middleName: 'Michael',
            lastName: 'Doe',
            email: 'john@email.com',
            password: defaultPassword,
            role: 'user',
        },
        {
            firstName: 'Janee',
            middleName: 'Michaela',
            lastName: 'Doe',
            email: 'jane@email.com',
            password: defaultPassword,
            role: 'user',
        },
    ]

    try {
        console.log('Users ..... SEEDING'.cyan.bold)

        if (args.includes('fresh')) {
            await User.deleteMany()
        }

        await User.create(users)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold)
        process.exit(1)
    }

    console.log('Users ..... DONE'.green.bold)
}

export default UserSeeder
