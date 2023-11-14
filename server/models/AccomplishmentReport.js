import mongoose, { Schema } from 'mongoose'


const accomplishmentReportSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        user: {type: Schema.ObjectId, ref: 'User'},
        file: {type: Object},
        link: { type: String },
        type: {type: String, required: true}
    },
    { timestamps: true }
)

// Create the User model
const AccomplishmentReport = mongoose.model('AccomplishmentReport', accomplishmentReportSchema)

export default AccomplishmentReport
