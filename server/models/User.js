import mongoose from 'mongoose'

const attendanceLogSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        timeIn: { type: Date, required: true },
        timeOut: { type: Date, required: true },
    },
    { timestamps: true }
)

// Define the User schema
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        attendanceLog: [attendanceLogSchema],
    },
    { timestamps: true }
)

// Create the User model
const User = mongoose.model('User', userSchema)

export default User
