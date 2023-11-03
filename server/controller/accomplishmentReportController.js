import jwt from 'jsonwebtoken'
import asyncHandler from '../middleware/asyncHandler.js'
import AccomplishmentReport from '../models/AccomplishmentReport.js'
import User from '../models/User.js';

// @desc    Get all accomplishment reports
// @route   GET /api/accomplishments-reports/
// @access  Private/Admin

const getAccomplishmentReports = asyncHandler(async (req, res) => {
    const { type } = req.query;
    
    if(type) {
        const accomplishmentReports = await AccomplishmentReport.find({type: type}).sort({_id: -1});
        res.status(200).json(accomplishmentReports)
    } else {
        const accomplishmentReports = await AccomplishmentReport.find({}).sort({_id: -1});
        res.status(200).json(accomplishmentReports)
    }

})

const storeAccomplishmentReports = asyncHandler(async (req, res) => {
    const {
        title,
        users,
        deadline,
        type
    } = req.body;

    try {
        const createdAccomplishmentReport = await AccomplishmentReport.create({
            title,
            users,
            deadline,
            type
        });

        const newAccomplishmentReport = {
            _id: createdAccomplishmentReport._id,
            title: createdAccomplishmentReport.title,
            users: createdAccomplishmentReport.users,
            deadline: createdAccomplishmentReport.deadline,
            type: createdAccomplishmentReport.type
        }

        res.status(201).json(newAccomplishmentReport);
    } catch(error) {
        res.status(400)
        throw new Error(error)
    }


})

const getAccomplishmentReportsPerUser = asyncHandler(async (req, res) => {
    const token = req.cookies.jwt;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const accomplishmentReports = await AccomplishmentReport.find({users: decoded.userId}).select('-users').sort({_id: -1});

    res.status(201).json(accomplishmentReports);
})

export { getAccomplishmentReports, storeAccomplishmentReports, getAccomplishmentReportsPerUser }
