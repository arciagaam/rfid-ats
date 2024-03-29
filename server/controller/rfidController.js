import Rfid from './../models/Rfid.js'
import User from './../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { compareUIDToDatabase, getAttendanceLog, getExistingAttendanceLog } from '../utils/logApi.js'

import {
    formatRfidData,
    getUserByRfid,
    getFullName,
    handleTimeIn,
    handleTimeOut,
    handleRfidNotFound,
    handleInvalidRequest,
    checkIfAfternoon,
    handlePMTimeIn,
} from '../utils/rfidHelpers.js'
import AttendanceLog from '../models/AttendanceLog.js'

let storingActive = false
let windowTimeout
let temporaryRfidData = []

const changeWindowState = asyncHandler(async (req, res) => {
    const { windowState } = req.body
    clearTimeout(windowTimeout)
    if (windowState == 'open') {
        storingActive = true
        console.log('window is open')

        req.io.emit('temporary_rfid_data', { temporaryRfidData })

        res.status(200).json({ message: 'window is open' })

        windowTimeout = setTimeout(() => {
            storingActive = false
        }, 13000)

    } else {
        storingActive = false
        console.log('window is closed')

        temporaryRfidData = []

        req.io.emit('temporary_rfid_data', { temporaryRfidData })
        res.status(200).json({ message: 'window is closed' })
    }
})

// @desc    Get rfids
// @route   GET /api/rfid
// @access  Public
const getRfids = asyncHandler(async (req, res) => {
    const rfids = await Rfid.find({}).sort({ status: 1 })
    res.status(200).json(rfids)
})

// @desc    Store temporary rfid/s
// @route   POST /api/rfid/add
// @access  Private/Admin
const storeRfid = asyncHandler(async (req, res) => {
    if (storingActive == false) {
        res.status(400)
        throw new Error('Add RFID window is not opened.')
    }

    const { rfidData } = req.body

    const formattedUID = formatRfidData(rfidData)
    const rfidExists = await Rfid.findOne({ rfidTag: formattedUID })

    if (rfidExists) {
        req.io.emit('error', { message: `Rfid Tag: ${formattedUID} already exists.` })

        res.status(404)
        throw new Error(`Rfid Tag: ${formattedUID} already exists.`)
    }

    // checks if rfid is already in temporaryRfidData
    const rfidInTemporaryRfidData = temporaryRfidData.find((rfid) => rfid.rfidTag === formattedUID)

    if (rfidInTemporaryRfidData) {
        req.io.emit('warning', { message: `Rfid Tag: ${formattedUID} already added.` })

        res.status(404)
        throw new Error(`Rfid Tag: ${formattedUID} already added.`)
    } else {
        temporaryRfidData = []

        temporaryRfidData.push({
            rfidTag: formattedUID,
        })

        req.io.emit('success', { message: `Rfid Tag: ${formattedUID} read.` })

        console.log('RFID added:', temporaryRfidData)
    }

    req.io.emit('temporary_rfid_data', { temporaryRfidData })
    res.json({ temporaryRfidData })
})

// @desc    Delete rfid
// @route   DELETE /api/rfid/:id
// @access  Private/Admin
const deleteRfid = asyncHandler(async (req, res) => {
    const rfid = await Rfid.findById(req.params.id)

    if (rfid) {
        const user = await User.findById(rfid.user)
        console.log('User:', user)

        if (user) {
            user.rfid = null
            user.status = 'no assigned RFID'
            await user.save()
        }

        await Rfid.deleteOne({ _id: rfid._id })

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

    if (!rfidData) {
        return handleInvalidRequest(res)
    }

    const formattedUID = formatRfidData(rfidData)
    console.log('RFID from reader:', formattedUID)

    const matchingRfid = await compareUIDToDatabase(formattedUID)

    if (matchingRfid) {
        const user = await getUserByRfid(matchingRfid.rfidTag)
        const fullName = getFullName(user)

        const existingLog = await getExistingAttendanceLog(matchingRfid.user)

        if (existingLog) {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const checkIfAmTimeout = await AttendanceLog.findOne({
                user: matchingRfid.user,
                date: {'$gte': startOfToday},
                AmTimeOut: {'$ne': null},
                PmTimeIn: null
            })

            if(checkIfAmTimeout) {
                return handlePMTimeIn(
                    req,
                    res,
                    existingLog,
                    fullName,
                    user.idNumber,
                    user.profilePicture
                )
            } else {
                return handleTimeOut(
                    req,
                    res,
                    existingLog,
                    fullName,
                    user.idNumber,
                    user.profilePicture
                )
            }


        } else {
            return handleTimeIn(
                req,
                res,
                matchingRfid.user,
                fullName,
                user.idNumber,
                user.profilePicture
            )
        }
    } else {
        return handleRfidNotFound(res)
    }
})

// @desc    Assign RFID to a user
// @route   PUT /api/rfid/assign
// @access  Private
const assignRfidToUser = asyncHandler(async (req, res) => {
    const { rfidTag, userId } = req.body

    const rfid = await Rfid.findOne({ rfidTag })

    if (!rfid) {
        res.status(404)
        throw new Error('Rfid not found')
    }

    if (userId) {
        const user = await User.findById(userId)

        if (!user) {
            res.status(404)
            throw new Error('User not found')
        }

        user.rfid = rfidTag
        user.status = 'active'
        await user.save()

        rfid.user = userId
        rfid.status = 'active'
    } else {
        const user = await User.findById(rfid.user)

        user.rfid = null
        user.status = 'no assigned RFID'
        await user.save()

        rfid.user = null
        rfid.status = 'not assigned'
    }

    await rfid.save()

    req.io.emit('rfid_assigned', { rfidTag, userId })
    res.status(200).json({ message: 'Rfid assigned to user' })
})

export {
    changeWindowState,
    getRfids,
    storeRfid,
    deleteRfid,
    getRfidFromReader,
    assignRfidToUser,
    temporaryRfidData,
}
