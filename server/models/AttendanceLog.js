import mongoose from 'mongoose'

const attendanceLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: { type: Date, required: true },
    timeIn: { type: Date, required: true },
    timeOut: { type: Date },
    totalTimeRendered: String,
    userName: { type: String },
}, { timestamps: true })

attendanceLogSchema.methods.calculateTotalTimeRendered = function() {
    if (this.timeIn && this.timeOut) {
        const timeDifference = this.timeOut - this.timeIn
        const hoursRendered = Math.floor(timeDifference / 3600000) // 1 hour = 3600000 milliseconds
        const minutesRendered = Math.floor((timeDifference % 3600000) / 60000) // 1 minute = 60000 milliseconds
        this.totalTimeRendered = `${hoursRendered}h ${minutesRendered}m`
    } else {
        this.totalTimeRendered = 'N/A'
    }
}

const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema)

export default AttendanceLog