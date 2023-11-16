import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

import users from '../data/userData.js'
import User from '../models/User.js'

import rfids from '../data/rfidData.js'
import Rfid from '../models/Rfid.js'

import attendanceLogs from '../data/logData.js'
import AttendanceLog from '../models/AttendanceLog.js'

import AccomplishmentReport from '../models/AccomplishmentReport.js'


import connectDB from '../db/connect.js'

dotenv.config()

await connectDB()

const importData = async () => {
    try {
        await User.deleteMany()
        await Rfid.deleteMany()
        await AccomplishmentReport.deleteMany()
        await AttendanceLog.deleteMany()

        const createdUsers = await User.insertMany(users)

        const populatedRfids = rfids.map((rfid, index) => {
            return {
                ...rfid,
                user: createdUsers[index]._id,
            }
        })

        const populatedAttendanceLogs = attendanceLogs.map((attendanceLog, index) => {
            return {
                ...attendanceLog,
                user: createdUsers[index]._id,
            }
        })

        await AttendanceLog.insertMany(populatedAttendanceLogs)
        await Rfid.insertMany(populatedRfids)

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
        await Rfid.deleteMany()
        await AccomplishmentReport.deleteMany()
        await AttendanceLog.deleteMany()

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
