import mongoose from 'mongoose'

const attendanceLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: { type: Date, required: true },
        timeIn: { type: Date, required: true },
        timeOut: { type: Date },
    },
    { timestamps: true }
)

const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema)

export default AttendanceLog