import User from '../models/User.js'
import AttendanceLog from '../models/AttendanceLog.js'

function formatRfidData(data) {
    return data.replace(/\s/g, '')
}

async function getUserByRfid(rfidTag) {
    return await User.findOne({ rfid: rfidTag })
}

function getFullName(user) {
    const { firstName, middleName, lastName } = user
    return `${firstName} ${middleName} ${lastName}`
}

async function handleTimeIn(req, res, userId, fullName) {
    const newLog = await AttendanceLog.create({
        user: userId,
        date: new Date(),
        timeIn: new Date(),
        timeOut: null,
    })

    await newLog.save()

    req.io.emit('newLog', newLog)

    res.status(200).json({
        message: `${fullName} has timed in at ${newLog.timeIn}`,
    })
}

async function handleTimeOut(req, res, existingLog, fullName) {
    existingLog.timeOut = new Date()

    existingLog.calculateTotalTimeWorked()
    await existingLog.save()

    req.io.emit('newLog', existingLog)

    res.status(200).json({
        message: `${fullName} has timed out at ${existingLog.timeOut}`,
    })
}

function handleInvalidRequest(res) {
    res.status(400).json({ error: 'Invalid request data' })
    throw new Error('Invalid request data')
}

function handleRfidNotFound(res) {
    console.log('RFID not found in database')
    res.status(404)
    throw new Error('RFID not found in database')
}

export {
    formatRfidData,
    getUserByRfid,
    getFullName,
    handleTimeIn,
    handleTimeOut,
    handleInvalidRequest,
    handleRfidNotFound,
}
