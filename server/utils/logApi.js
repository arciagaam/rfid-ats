import Rfid from '../models/Rfid.js'
import AttendanceLog from '../models/AttendanceLog.js'
import { checkIfAfternoon } from './rfidHelpers.js'

const compareUIDToDatabase = async (uidFromESP8266) => {
    const rfid = await Rfid.findOne({ rfidTag: uidFromESP8266 })

    if (rfid) {
        return rfid
    } else {
        return null
    }
}

const getAttendanceLog = async (userId) => {
    return await AttendanceLog.findOne({
        user: userId,
        timeOut: null, // Find logs with no time out
    })
}

const getExistingAttendanceLog = async (userId) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if(checkIfAfternoon()) {
        return await AttendanceLog.findOne({
            user: userId,
            date: {'$gte': startOfToday},
            PmTimeOut: null
        })
    } else {
        return await AttendanceLog.findOne({
            user: userId,
            date: {'$gte': startOfToday},
            AmTimeOut: null
        })
    }

}


export { compareUIDToDatabase, getAttendanceLog, getExistingAttendanceLog }
