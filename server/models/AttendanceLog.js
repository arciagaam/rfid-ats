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
        totalTimeWorked: String, // You can set the type to String or any other suitable type
    },
    { timestamps: true }
)

attendanceLogSchema.methods.calculateTotalTimeWorked = function () {
    if (this.timeIn && this.timeOut) {
        const timeDifference = this.timeOut - this.timeIn
        const hoursWorked = Math.floor(timeDifference / 3600000) // 1 hour = 3600000 milliseconds
        const minutesWorked = Math.floor((timeDifference % 3600000) / 60000) // 1 minute = 60000 milliseconds
        this.totalTimeWorked = `${hoursWorked}h ${minutesWorked}m`
    } else {
        this.totalTimeWorked = 'N/A'
    }
}

const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema)

export default AttendanceLog
