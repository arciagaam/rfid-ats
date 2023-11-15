import Rfid from './../models/Rfid.js'
import User from './../models/User.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { compareUIDToDatabase, getAttendanceLog } from '../utils/logApi.js'

import {
    formatRfidData,
    getUserByRfid,
    getFullName,
    handleTimeIn,
    handleTimeOut,
    handleRfidNotFound,
} from '../utils/rfidHelpers.js'

let storingActive = false
let windowTimeout

const changeWindowState = asyncHandler(async (req, res) => {
    const { windowState } = req.body
    clearTimeout(windowTimeout)
    if (windowState == 'open') {
        storingActive = true
        res.status(200).json({ message: 'window is open' })

        windowTimeout = setTimeout(() => {
            storingActive = false
        }, 13000)
    } else {
        storingActive = false
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

// @desc    Store new rfid
// @route   PUT /api/rfid
// @access  Public
const storeRfid = asyncHandler(async (req, res) => {
    if (storingActive == false) {
        res.status(400)
        throw new Error('Add RFID window is not opened.')
    }

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
        const newRfid = {
            _id: rfid._id,
            rfidTag: rfid.rfidTag,
            status: rfid.status,
        }
        req.io.emit('new_rfid', { message: 'New RFID card added.', ...newRfid })

        res.status(201).json(newRfid)
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

    if (!rfidData) {
        return handleInvalidRequest(res)
    }

    const formattedUID = formatRfidData(rfidData)
    console.log('RFID from reader:', formattedUID)

    const matchingRfid = await compareUIDToDatabase(formattedUID)

    if (matchingRfid) {
        const user = await getUserByRfid(matchingRfid.rfidTag)
        const fullName = getFullName(user)

        const existingLog = await getAttendanceLog(matchingRfid.user)

        if (existingLog) {
            return handleTimeOut(req, res, existingLog, fullName)
        } else {
            return handleTimeIn(req, res, matchingRfid.user, fullName)
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
        user.status = 'not registered'
        await user.save()

        rfid.user = null
        rfid.status = 'not assigned'
    }

    await rfid.save()

    req.io.emit('rfid_assigned', { rfidTag, userId })
    res.status(200).json({ message: 'Rfid assigned to user' })
})

export { changeWindowState, getRfids, storeRfid, deleteRfid, getRfidFromReader, assignRfidToUser }
