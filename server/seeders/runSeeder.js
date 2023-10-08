import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import users from '../data/userData.js'
import User from '../models/User.js'

import connectDB from '../db/connect.js'

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await User.deleteMany()
        // await AttendanceLog.deleteMany()

        const createdUsers = await User.insertMany(users)

        console.log('Data Imported!'.green.bold)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.bold)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()
        // await AttendanceLog.deleteMany()

        console.log('Data Destroyed!'.red.bold)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.bold)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}
