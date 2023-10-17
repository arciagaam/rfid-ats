import Rfid from './../models/Rfid.js'
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
    const rfids = await Rfid.find({}).sort({ _id: -1 })
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

export { changeWindowState, getRfids, storeRfid, deleteRfid, getRfidFromReader }
