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

async function handleTimeIn(req, res, userId, fullName, idNumber, profilePicture = null) {

    const newLog = checkIfAfternoon() 
        ? await AttendanceLog.create({
            user: userId,
            userName: fullName,
            date: new Date(),
            AmTimeIn: null,
            AmTimeOut: null,
            PmTimeIn: new Date(),
            PmTimeOut: null,
        })
        : await AttendanceLog.create({
            user: userId,
            userName: fullName,
            date: new Date(),
            AmTimeIn: new Date(),
            AmTimeOut: null,
            PmTimeIn: null,
            PmTimeOut: null,
        })

        await newLog.save()

    const newFetchLog = await AttendanceLog.findOne({ _id: newLog._id }).lean()

    req.io.emit('newLog', { ...newFetchLog, idNumber, profilePicture, isTimeIn: true })

    res.status(200).json({
        message: `${fullName} has timed in at ${checkIfAfternoon() ? newLog.PmTimeIn : newLog.AmTimeIn}`,
    })
}

async function handlePMTimeIn(req, res, existingLog, fullName, idNumber, profilePicture = null) {

    existingLog.PmTimeIn = new Date()
    await existingLog.save()

    const newFetchLog = await AttendanceLog.findOne({ _id: existingLog._id }).lean()

    req.io.emit('newLog', { ...newFetchLog, idNumber, profilePicture, isTimeIn: true })

    res.status(200).json({
        message: `${fullName} has timed in at ${existingLog.PmTimeIn}`
    })
}

async function handleTimeOut(req, res, existingLog, fullName, idNumber, profilePicture = null) {

    checkIfAfternoon() ? existingLog.PmTimeOut = new Date() : existingLog.AmTimeOut = new Date()
    
    existingLog.calculateTotalTimeRendered()

    await existingLog.save()

    const newFetchLog = await AttendanceLog.findOne({ _id: existingLog._id }).lean()

    req.io.emit('newLog', { ...newFetchLog, idNumber, profilePicture, isTimeIn: false })

    res.status(200).json({
        message: `${fullName} has timed out at ${checkIfAfternoon() ? existingLog.PmTimeOut : existingLog.AmTimeOut}`
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

function checkIfAfternoon() {
    const now = new Date();
    const hour = now.getHours();

    return (hour >= 12 && hour <= 23)
}

export {
    formatRfidData,
    getUserByRfid,
    getFullName,
    handleTimeIn,
    handleTimeOut,
    handlePMTimeIn,
    handleInvalidRequest,
    handleRfidNotFound,
    checkIfAfternoon
}