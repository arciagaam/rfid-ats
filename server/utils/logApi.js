import Rfid from '../models/Rfid.js'
import AttendanceLog from '../models/AttendanceLog.js'

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

export { compareUIDToDatabase, getAttendanceLog }
