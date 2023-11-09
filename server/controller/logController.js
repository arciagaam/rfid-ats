import asyncHandler from '../middleware/asyncHandler.js'
import AttendanceLog from '../models/AttendanceLog.js'

// @desc    Get logs of a user
// @route   GET /api/users/logs/:id
// @access  Private/Admin
const getLogs = asyncHandler(async(req, res) => {
    const logs = await AttendanceLog.find({ user: req.params.id })
        .populate('user', 'name')
        .sort({ updatedAt: -1 })

    res.status(200).json(logs)
})

// @desc    Get all logs
// @route   GET /api/users/logs
// @access  Private/Admin
const getAllLogs = asyncHandler(async(req, res) => {
    const logs = await AttendanceLog.find({})
        .populate('user', ['firstName', 'middleName', 'lastName'])
        .populate('userName', 'firstName middleName lastName')
        .sort({ updatedAt: -1 })

    res.status(200).json(logs)
})

export { getLogs, getAllLogs }