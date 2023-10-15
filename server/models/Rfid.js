import mongoose from 'mongoose'

const rfidSchema = new mongoose.Schema(
    {
        rfidTag: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, required: true, default: 'inactive' },
    },
    { timestamps: true }
)

// Create the User model
const Rfid = mongoose.model('Rfid', rfidSchema)

export default Rfid
