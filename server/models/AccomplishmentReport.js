import mongoose, { Schema } from 'mongoose'


const accomplishmentReportSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        users: [{type: Schema.ObjectId, ref: 'User'}],
        deadline: {type: Date, required: true},
        type: {type: String, required: true}
    },
    { timestamps: true }
)

// Create the User model
const AccomplishmentReport = mongoose.model('AccomplishmentReport', accomplishmentReportSchema)

export default AccomplishmentReport
