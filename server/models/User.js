import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
        status: { type: String, required: true },
        attendanceLog: [attendanceLogSchema],
    },
    { timestamps: true }
)

// Check if password matches the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Encrypt password before save
userSchema.pre('save', async function (next) {
    // If password is not modified, call next middleware
    if (!this.isModified('password')) {
        next()
    }

    // Generate salt
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

// Create the User model
const User = mongoose.model('User', userSchema)

export default User
