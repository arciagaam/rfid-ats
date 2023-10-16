import Rfid from './../models/Rfid.js'
import AttendanceLog from '../models/AttendanceLog.js'
import User from '../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { compareUIDToDatabase, getAttendanceLog } from '../utils/logApi.js'

// @desc    Get rfids
// @route   GET /api/users/rfid
// @access  Public
const getRfids = asyncHandler(async (req, res) => {
    const rfids = await Rfid.find({})
    res.status(200).json(rfids)
})

// @desc    Store new rfid
// @route   PUT /api/users/rfid
// @access  Public
const storeRfid = asyncHandler(async (req, res) => {
    const { rfidTag } = req.body

    const rfidExists = await Rfid.findOne({ rfidTag })

    if (rfidExists) {
        res.status(400)
        throw new Error('Rfid ID already exists.')
    }

    const rfid = await Rfid.create({
        rfidTag,
        status: 'inactive',
    })

    if (rfid) {
        res.status(201).json({
            _id: rfid._id,
            rfidTag: rfid.rfidTag,
            status: rfid.status,
        })
    } else {
        res.status(400)
        throw new Error('Invalid rfid data')
    }
})

// @desc    Delete rfid
// @route   DELETE /api/users/rfid
// @access  Private/Admin
const deleteRfid = asyncHandler((req, res) => {
    const rfid = Rfid.findById(req.params.id)

    if (rfid) {
        Rfid.deleteOne({ _id: rfid._id })
        res.status(200).json({ message: 'Rfid deleted' })
    } else {
        res.status(404)
        throw new Error('Rfid not found')
    }
})

// @desc    Reads rfid from reader
// @route   POST /api/rfid
// @access  Public
const getRfidFromReader = asyncHandler(async (req, res) => {
    const { rfidData } = req.body

    if (rfidData) {
        // Remove spaces from the UID received from ESP8266
        const formattedUID = rfidData.replace(/\s/g, '')

        console.log('RFID from reader:', formattedUID)

        const matchingRfid = await compareUIDToDatabase(formattedUID)

        if (matchingRfid) {
            // Get user name from matching rfid
            const user = await User.findOne({ rfid: matchingRfid.rfidTag })
            const { firstName, middleName, lastName } = user
            const fullName = `${firstName} ${middleName} ${lastName}`

            // Check if user has existing attendance log
            const existingLog = await getAttendanceLog(matchingRfid.user)

            if (existingLog) {
                existingLog.timeOut = new Date()

                await existingLog.save()
                res.status(200).json({
                    message: `${fullName} has timed out at ${existingLog.timeOut}`,
                })
            } else {
                const newLog = await AttendanceLog.create({
                    user: matchingRfid.user,
                    date: new Date(),
                    timeIn: new Date(),
                    timeOut: null,
                })

                await newLog.save()
                res.status(200).json({
                    message: `${fullName} has timed in at ${newLog.timeIn}`,
                })
            }

            // res.status(200).json({ rfid: matchingRfid })
        } else {
            console.log('RFID not found in database')
            res.status(404)
            throw new Error('RFID not found in database')
        }
    } else {
        res.status(400).json({ error: 'Invalid request data' })
        throw new Error('Invalid request data')
    }
})

export { getRfids, storeRfid, deleteRfid, getRfidFromReader }
