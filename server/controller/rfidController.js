import Rfid from './../models/Rfid.js'
import asyncHandler from '../middleware/asyncHandler.js'
import compareUIDToDatabase from '../utils/compareUID.js'

let storingActive = false;
let windowTimeout;

const storeRfidWindow = asyncHandler(async (req, res) => {
    clearTimeout(windowTimeout);
    storingActive = true;
    res.status(200).json({message: 'Window is open'})
    
    windowTimeout = setTimeout(() => {
        storingActive = false;
    }, 11000);
})

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

    if(!storingActive) {
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

const getRfidFromReader = asyncHandler(async (req, res) => {
    const { rfidData } = req.body

    if (rfidData) {
        // Remove spaces from the UID received from ESP8266
        const formattedUID = rfidData.replace(/\s/g, '')

        console.log('RFID from reader:', formattedUID)

        const matchingRfid = await compareUIDToDatabase(formattedUID)

        if (matchingRfid) {
            console.log('RFID found in database')

            // timeins and timeouts

            res.status(200).json({ rfid: matchingRfid })
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

export { storeRfidWindow, getRfids, storeRfid, deleteRfid, getRfidFromReader }
