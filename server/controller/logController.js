import asyncHandler from '../middleware/asyncHandler.js'
import AttendanceLog from '../models/AttendanceLog.js'

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
    // const logs = await AttendanceLog.find({})
    //     .populate('user')
    //     .populate('userName', 'firstName middleName lastName')
    //     .sort({ updatedAt: -1 })

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
    ])

    res.status(200).json(logs)
})

const getAllLogsByDate = asyncHandler(async (req, res) => {
    const { date } = req.body.date

    const _date = new Date(date).toLocaleDateString()
    const start = new Date(_date)
    const end = new Date(new Date(_date).setHours(23, 59, 59))

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
})

export { getLogs, getAllLogs, getAllLogsByDate }
