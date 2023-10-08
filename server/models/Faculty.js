import mongoose from 'mongoose'

// Define the Faculty schema
const facultySchema = new mongoose.Schema(
    {
        idNumber: { type: String, required: true },
        rfid: { type: String, required: true  },
        birthday: { type: Date, required: true },
        sex: { type: String, required: true, unique: true },
        contactNumber: { type: String, required: true },
        address: { type: String, required: true },
    },
    
    { timestamps: true }
)


// Create the User model
const Faculty = mongoose.model('Faculty', facultySchema)

export default Faculty
