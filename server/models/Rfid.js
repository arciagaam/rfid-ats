import mongoose from 'mongoose'

const rfidSchema = new mongoose.Schema({
    rfidTag: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true, default: 'not assigned' },
}, { timestamps: true })

rfidSchema.pre('save', function(next) {
    if (!this.user) {
        this.status = 'not assigned'
    }
    next()
})

const Rfid = mongoose.model('Rfid', rfidSchema)

export default Rfid