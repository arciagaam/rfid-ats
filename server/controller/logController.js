import asyncHandler from '../middleware/asyncHandler.js'
import AttendanceLog from '../models/AttendanceLog.js'

// @desc    Get logs of a user
// @route   GET /api/users/logs/:id
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
    const logs = await AttendanceLog.find({ user: req.params.id }).populate('user', 'name')

    res.status(200).json(logs)
})

export { getLogs }
