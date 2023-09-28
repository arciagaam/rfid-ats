import UserSeeder from './UserSeeder.js'
import connectDB from '../db/connect.js'
import colors from 'colors'

import dotenv from 'dotenv'
dotenv.config()

async function run() {
    try {
        await connectDB(process.env.MONGO_URI)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

    const seeders = await Promise.allSettled([UserSeeder()])

    console.log('Seeding Complete!'.green.bold)
    process.exit(0)
}

run()
