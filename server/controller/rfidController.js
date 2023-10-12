import Rfid from './../models/Rfid.js'
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get rfids
// @route   GET /api/users/rfid
// @access  Public
const getRfids = asyncHandler(async (req, res) => {
    const rfids = await Rfid.find({});
    res.status(200).json(rfids)
});

// @desc    Store new rfid
// @route   PUT /api/users/rfid
// @access  Public
const storeRfid = asyncHandler(async(req, res) => {
    const {number} = req.body;

    const rfidExists = await Rfid.findOne({ number })

    if (rfidExists) {
        res.status(400)
        throw new Error('Rfid ID already exists.')
    }

    const rfid = await Rfid.create({
        number,
        status: 'inactive'
    })

    if(rfid) {
        res.status(201).json({
            _id: rfid._id,
            number: rfid.number,
            status: rfid.status,
        });
    } else {
        res.status(400)
        throw new Error('Invalid rfid data')
    }
})

const deleteRfid = asyncHandler((req, res) => {
    const rfid = Rfid.findById(req.params.id);

    if(rfid) {
        Rfid.deleteOne({_id: rfid._id})
        res.status(200).json({ message: 'Rfid deleted' })
    } else {
        res.status(404)
        throw new Error('Rfid not found')
    }
});

export {
    getRfids,
    storeRfid
}