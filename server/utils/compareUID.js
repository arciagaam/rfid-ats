import Rfid from './../models/Rfid.js'

const compareUIDToDatabase = async (uidFromESP8266) => {
    const rfid = await Rfid.findOne({ rfidTag: uidFromESP8266 })

    if (rfid) {
        return rfid
    } else {
        return null
    }
}

export default compareUIDToDatabase
