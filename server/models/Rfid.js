import mongoose from 'mongoose'

const rfidSchema = new mongoose.Schema(
    {
        number: { type: String, required: true },
        status: { type: String, required: true, default: 'inactive' },
    },
    { timestamps: true }
)

// Create the User model
const Rfid = mongoose.model('Rfid', rfidSchema)

export default Rfid
