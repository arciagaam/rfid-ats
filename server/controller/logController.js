import asyncHandler from '../middleware/asyncHandler.js'
import AttendanceLog from '../models/AttendanceLog.js'
import mongoose from 'mongoose'
// @desc    Get logs of a user
// @route   GET /api/users/logs/:id
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
    const logs = await AttendanceLog.find({ user: req.params.id })
        .populate('user', 'name')
        .sort({ updatedAt: -1 })

    res.status(200).json(logs)
})

// @desc    Get all logs
// @route   GET /api/users/logs
// @access  Private/Admin
const getAllLogs = asyncHandler(async (req, res) => {
    const logs = await AttendanceLog.aggregate([
        {
            $lookup: {
                from: 'users',
                let: {
                    userId: '$user',
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$department', req.user.department] },
                                    { $eq: ['$$userId', '$_id'] },
                                ],
                            },
                        },
                    },
                ],
                as: 'user',
            },
        },
        { $match: { user: { $ne: [] } } },
        { $unwind: '$user' },
        { $sort: { updatedAt: -1 } },
    ])

    res.status(200).json(logs)
})

const getAllLogsByDate = asyncHandler(async (req, res) => {
    const { dateFrom, dateTo } = req.body.values
    const { userId } = req.body;
    const start = new Date(new Date(dateFrom).toLocaleDateString())
    const end = new Date(new Date(dateTo).setHours(23, 59, 59))

    if(!userId) {
        const logs = await AttendanceLog.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        userId: '$user',
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$department', req.user.department] },
                                        { $eq: ['$$userId', '$_id'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'user',
                },
            },
            { $match: { user: { $ne: [] } } },
            { $unwind: '$user' },
        ])
    
        res.status(200).json(logs)
    } else {
        const logs = await AttendanceLog.where('user').equals(userId).sort({date: -1})
        res.status(200).json(logs) 
    }


})

export { getLogs, getAllLogs, getAllLogsByDate }
