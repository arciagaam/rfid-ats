import mongoose from 'mongoose'

const attendanceLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: { type: Date, required: true },
    AmTimeIn: { type: Date },
    AmTimeOut: { type: Date },
    PmTimeIn: { type: Date },
    PmTimeOut: { type: Date },
    totalTimeRendered: String,
    userName: { type: String },
}, { timestamps: true })

attendanceLogSchema.methods.calculateTotalTimeRendered = function () {

    const amTimeDifference = this.AmTimeOut - this.AmTimeIn;
    const pmTimeDifference = this.PmTimeOut - this.PmTimeIn;
    let totalTimeDifference;

    if (!isNaN(parseInt(amTimeDifference)) && !isNaN(parseInt(pmTimeDifference))) {
        totalTimeDifference = amTimeDifference + pmTimeDifference;
    } else if (!isNaN(parseInt(amTimeDifference)) && isNaN(parseInt(pmTimeDifference))) {
        totalTimeDifference = amTimeDifference;
    } else if (isNaN(parseInt(amTimeDifference)) && !isNaN(parseInt(pmTimeDifference))) {
        totalTimeDifference = pmTimeDifference
    } else {
        this.totalTimeRendered = 'N/A'
        return
    }

    // const timeDifference = this.timeOut - this.timeIn
    const hoursRendered = Math.floor(totalTimeDifference / 3600000) // 1 hour = 3600000 milliseconds
    const minutesRendered = Math.floor((totalTimeDifference % 3600000) / 60000) // 1 minute = 60000 milliseconds
    this.totalTimeRendered = `${hoursRendered}h ${minutesRendered}m`
}

const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema)

export default AttendanceLog